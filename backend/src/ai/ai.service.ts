import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import OpenAI from 'openai';

type HistoryMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const DEFAULT_MODELS = [
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'google/gemma-4-26b-a4b-it:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'openrouter/free',
];

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly models = this.getConfiguredModels();
  private readonly openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer':
        process.env.OPENROUTER_SITE_URL ?? 'http://localhost:8080/',
      'X-OpenRouter-Title': process.env.OPENROUTER_APP_NAME ?? 'Krishok.ai',
    },
  });

  async askKrishokAi(
    question: string,
    history: HistoryMessage[] = [],
  ): Promise<string> {
    const cleanQuestion = question.trim();
    if (/^(hi|hello|hey|হাই|হ্যালো|হেলো)[!,.?\s]*$/i.test(cleanQuestion)) {
      return 'কৃষি বিষয়ে কী জানতে চান?';
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are Krishok.ai, a Bangladeshi agriculture assistant.
  Rules:
  - Reply only about agriculture, farming, crops, plant disease, fertilizer, pesticide, irrigation, soil, livestock, fish farming, weather-related farming advice.
  - Always reply in simple Bangla.
  - Never say "নমস্কার", "স্বাগতম", or return a social greeting.
  - If the user only says hi, hello, hey, হাই, হ্যালো, or হেলো, reply exactly: "কৃষি বিষয়ে কী জানতে চান?"
  - If the question is outside agriculture, politely refuse.
  - Do not answer programming, politics, entertainment, religion, personal, or general knowledge questions.
  - For pesticide or medicine advice, suggest consulting a local agriculture officer or qualified vendor before applying.`,
      },
      ...history,
      { role: 'user', content: cleanQuestion },
    ];

    let lastError: unknown;
    for (const [index, model] of this.models.entries()) {
      try {
        const completion = await this.openai.chat.completions.create({
          model,
          messages,
        });
        const answer = completion.choices[0]?.message?.content?.trim();
        if (!answer) throw new Error('Model returned an empty response');

        this.logger.log(
          `AI response generated with model: ${completion.model ?? model}`,
        );
        return answer;
      } catch (error) {
        lastError = error;
        const hasNextModel = index < this.models.length - 1;
        this.logger.warn(
          `AI model failed: ${model} (${this.getErrorMessage(error)})${hasNextModel ? '; trying fallback' : ''}`,
        );
        if (!hasNextModel || !this.canFallback(error)) break;
      }
    }

    this.logger.error(
      `All AI models failed (${this.models.join(' -> ')}): ${this.getErrorMessage(lastError)}`,
    );
    throw new ServiceUnavailableException(
      'AI service is temporarily unavailable. Please try again shortly.',
    );
  }

  getModelPriority(): readonly string[] {
    return this.models;
  }

  private getConfiguredModels(): string[] {
    const configured = process.env.OPENROUTER_MODELS?.split(',')
      .map((model) => model.trim())
      .filter(Boolean);
    const models = configured?.length ? configured : DEFAULT_MODELS;
    return [...new Set(models)];
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  private canFallback(error: unknown): boolean {
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? Number((error as { status?: unknown }).status)
        : undefined;
    // Authentication failures will affect every model, so retrying is wasteful.
    if (status === 401) return false;
    return true;
  }
}
