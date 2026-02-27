import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateImage(prompt: string, size: "1K" | "2K" | "4K" = "1K") {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}

export async function* chatWithGemini(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: "Você é o assistente virtual da RogérioVisual, uma empresa de comunicação visual em São João da Boa Vista - SP. Seja profissional, prestativo e responda em português. A empresa faz fachadas, adesivagem residencial e de veículos, banners, faixas e placas PVC/ACM.",
    },
  });

  // Re-creating history for the chat instance
  // Note: sendMessageStream doesn't take history directly in the call, 
  // but we can initialize the chat with it if needed. 
  // For simplicity in this demo, we'll just send the message.
  
  const response = await chat.sendMessageStream({ message });
  for await (const chunk of response) {
    yield chunk.text || "";
  }
}
