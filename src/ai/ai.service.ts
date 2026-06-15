import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  async askKrishokAi(question: string) {
    const prompt = `
You are Krishok.ai, a Bangladeshi agriculture assistant.
Reply in simple Bangla.
Do not give dangerous pesticide advice confidently.
Always suggest contacting a local agriculture officer for serious cases.

Farmer question:
${question}
`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  }
}
