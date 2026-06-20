import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
      'X-OpenRouter-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
    },
  });

  async askKrishokAi(
    question: string,
    history: Array<{
      role: 'user' | 'assistant';
      content: string;
    }> = [],
  ) {
    if (/^(hi|hello|hey|হাই|হ্যালো|হেলো)[!,.?\s]*$/i.test(question.trim())) {
      return 'কৃষি বিষয়ে কী জানতে চান?';
    }
    const completion = await this.openai.chat.completions.create({
      model: 'google/gemma-4-31b-it:free',
      messages: [
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
          - For pesticide/medicine advice, suggest consulting local agriculture officer/vendor before applying.`,
        },
        ...history,
        {
          role: 'user',
          content: question,
        },
      ],
    });

    return completion.choices?.[0]?.message?.content ?? '';
  }
}

// import { Injectable } from '@nestjs/common';
// import { GoogleGenAI } from '@google/genai';

// @Injectable()
// export class AiService {
//   private ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY!,
//   });

//   async askKrishokAi(question: string) {
//     const prompt = `
// You are Krishok.ai, a Bangladeshi agriculture assistant.
// Reply in simple Bangla.
// Do not give dangerous pesticide advice confidently.
// Always suggest contacting a local agriculture officer for serious cases.

// Farmer question:
// ${question}
// `;

//     const response = await this.ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: prompt,
//     });

//     return response.text;
//   }
// }
