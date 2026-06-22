import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Content, GoogleGenerativeAI, Part } from '@google/generative-ai';
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

const DEFAULT_VISION_MODELS = ['openrouter/free', 'google/gemma-3-27b-it:free'];
const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite';

const GEMINI_SYSTEM_INSTRUCTION = `You are Krishok.ai, a Bangladeshi agriculture assistant.
Rules:
- Reply only about agriculture, farming, crops, plant disease, fertilizer, pesticide, irrigation, soil, livestock, fish farming, and weather-related farming advice.
- Always reply in simple Bangla.
- Never return a social greeting.
- If the user only says hi, hello, hey, হাই, হ্যালো, or হেলো, reply exactly: "কৃষি বিষয়ে কী জানতে চান?"
- If the question is outside agriculture, politely refuse.
- When an image is provided, inspect the actual image before answering.
- Never assume every uploaded image is a crop, tomato, plant, or disease.
- If the image shows a person or a non-agricultural object, say what is visibly shown and do not invent crop symptoms.
- If image evidence is unclear, state that you are not certain and ask for a clearer close-up.
- Do not answer programming, politics, entertainment, religion, personal, or general knowledge questions.
- For pesticide or medicine advice, suggest consulting a local agriculture officer or qualified vendor before applying.`;

const GEMINI_IMAGE_INSTRUCTION = `প্রথমে ছবিটি মনোযোগ দিয়ে দেখুন এবং ছবিতে আসলে কী আছে তা শনাক্ত করুন।
ছবিতে কৃষি-সম্পর্কিত কিছু না থাকলে কোনো রোগ বা ফসল অনুমান করবেন না।
শুধু দৃশ্যমান প্রমাণের ভিত্তিতে উত্তর দিন। নিশ্চিত না হলে অনিশ্চয়তা জানান এবং পরিষ্কার কৃষি-সম্পর্কিত ছবি চাইুন।`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly models = this.getConfiguredModels();
  private readonly visionModels = this.getConfiguredVisionModels();
  private readonly geminiModel =
    process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  private readonly gemini = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;
  private readonly openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer':
        process.env.OPENROUTER_SITE_URL ?? 'http://localhost:3000/',
      'X-OpenRouter-Title': process.env.OPENROUTER_APP_NAME ?? 'Krishok.ai',
    },
  });

  async askKrishokAi(
    question: string,
    history: HistoryMessage[] = [],
    imageUrl?: string,
  ): Promise<string> {
    const cleanQuestion = question.trim();
    if (/^(hi|hello|hey|হাই|হ্যালো|হেলো)[!,.?\s]*$/i.test(cleanQuestion)) {
      return 'কৃষি বিষয়ে কী জানতে চান?';
    }

    if (this.gemini) {
      try {
        const answer = await this.askGemini(cleanQuestion, history, imageUrl);
        this.logger.log(
          `AI response generated directly with Gemini model: ${this.geminiModel}`,
        );
        return answer;
      } catch (error) {
        if (!this.isGeminiLimitError(error)) {
          this.logger.error(
            `Direct Gemini request failed (${this.getErrorMessage(error)})`,
          );
          throw new ServiceUnavailableException(
            'AI service is temporarily unavailable. Please try again shortly.',
          );
        }

        this.logger.warn(
          `Direct Gemini limit reached (${this.getErrorMessage(error)}); using OpenRouter fallback`,
        );
      }
    } else {
      this.logger.warn(
        'GEMINI_API_KEY is not configured; using OpenRouter fallback',
      );
    }

    const userContent: OpenAI.Chat.Completions.ChatCompletionUserMessageParam['content'] =
      imageUrl
        ? [
            {
              type: 'text',
              text: `${cleanQuestion}

              প্রথমে ছবিটি মনোযোগ দিয়ে দেখুন এবং ছবিতে আসলে কী আছে তা শনাক্ত করুন।
              ছবিতে গাছ, ফসল, পাতা, ফল, মাটি, গবাদিপশু, মাছ বা কৃষি-সম্পর্কিত কিছু না থাকলে কোনো রোগ বা ফসল অনুমান করবেন না।
              মানুষের ছবি হলে স্পষ্টভাবে বলুন: "এই ছবিতে একজন মানুষ দেখা যাচ্ছে; এটি ফসল বা গাছের ছবি নয়।"
              শুধু দৃশ্যমান প্রমাণের ভিত্তিতে উত্তর দিন। নিশ্চিত না হলে অনিশ্চয়তা জানান এবং পরিষ্কার কৃষি-সম্পর্কিত ছবি চাইুন।`,
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ]
        : cleanQuestion;

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
                - When an image is provided, inspect the actual image before answering.
                - Never assume every uploaded image is a crop, tomato, plant, or disease.
                - If the image shows a person or a non-agricultural object, say what is visibly shown and do not invent crop symptoms.
                - If image evidence is unclear, state that you are not certain and ask for a clearer close-up.
                - Do not answer programming, politics, entertainment, religion, personal, or general knowledge questions.
                - For pesticide or medicine advice, suggest consulting a local agriculture officer or qualified vendor before applying.`,
      },
      ...history,
      { role: 'user', content: userContent },
    ];

    let lastError: unknown;
    const candidateModels = imageUrl ? this.visionModels : this.models;
    for (const [index, model] of candidateModels.entries()) {
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
        const hasNextModel = index < candidateModels.length - 1;
        this.logger.warn(
          `AI model failed: ${model} (${this.getErrorMessage(error)})${hasNextModel ? '; trying fallback' : ''}`,
        );
        if (!hasNextModel || !this.canFallback(error)) break;
      }
    }

    this.logger.error(
      `All AI models failed (${candidateModels.join(' -> ')}): ${this.getErrorMessage(lastError)}`,
    );
    throw new ServiceUnavailableException(
      'AI service is temporarily unavailable. Please try again shortly.',
    );
  }

  getModelPriority(): readonly string[] {
    return this.models;
  }

  private async askGemini(
    question: string,
    history: HistoryMessage[],
    imageUrl?: string,
  ): Promise<string> {
    if (!this.gemini) {
      throw new Error('Gemini client is not configured');
    }

    const contents: Content[] = history.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));
    const parts: Part[] = [
      {
        text: imageUrl
          ? `${question}\n\n${GEMINI_IMAGE_INSTRUCTION}`
          : question,
      },
    ];

    if (imageUrl) {
      parts.push({ inlineData: await this.downloadImage(imageUrl) });
    }
    contents.push({ role: 'user', parts });

    const model = this.gemini.getGenerativeModel({
      model: this.geminiModel,
      systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
    });
    const chat = model.startChat({ history: contents });
    const result = await chat.sendMessage(parts);
    const answer = result.response.text().trim();
    if (!answer) throw new Error('Gemini returned an empty response');
    return answer;
  }

  private async downloadImage(
    imageUrl: string,
  ): Promise<{ data: string; mimeType: string }> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(
        `Could not download image (${response.status} ${response.statusText})`,
      );
    }

    const mimeType = response.headers.get('content-type')?.split(';')[0];
    if (!mimeType?.startsWith('image/')) {
      throw new Error(
        `Unsupported image content type: ${mimeType ?? 'unknown'}`,
      );
    }

    const data = Buffer.from(await response.arrayBuffer()).toString('base64');
    return { data, mimeType };
  }

  private getConfiguredModels(): string[] {
    const configured = process.env.OPENROUTER_MODELS?.split(',')
      .map((model) => model.trim())
      .filter(Boolean);
    const models = configured?.length ? configured : DEFAULT_MODELS;
    return [...new Set(models)];
  }

  private getConfiguredVisionModels(): string[] {
    const configured = process.env.OPENROUTER_VISION_MODELS?.split(',')
      .map((model) => model.trim())
      .filter(Boolean);
    const models = configured?.length ? configured : DEFAULT_VISION_MODELS;
    return [...new Set(models)];
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  private isGeminiLimitError(error: unknown): boolean {
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? Number((error as { status?: unknown }).status)
        : undefined;
    if (status === 429) return true;

    const message = this.getErrorMessage(error).toLowerCase();
    return (
      message.includes('resource_exhausted') ||
      message.includes('quota') ||
      message.includes('rate limit')
    );
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
