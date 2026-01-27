
import { GoogleGenAI, Type } from "@google/genai";
import { GasStatus, AiInsight } from "../types";

export const geminiService = {
  getSmartInsights: async (status: GasStatus): Promise<AiInsight> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Analise os dados do sensor IoT de um botijão de gás e retorne um objeto JSON.
      Dados:
      - Nível de Gás: ${status.level}%
      - Tipo: ${status.cylinderType}
      - Bateria do Sensor: ${status.battery}%
      - Sinal Wi-Fi: ${status.signal}%
      - Status: ${status.isOnline ? 'Online' : 'Offline'}
      
      Regras:
      1. statusSummary: Uma frase curta sobre o estado atual.
      2. safetyTip: Uma dica de segurança baseada no nível ou tipo.
      3. recommendation: O que o usuário deve fazer agora (ex: pedir refil, trocar bateria, ou apenas relaxar).
      4. sentiment: 'positive' se nível > 30%, 'warning' se entre 15-30% ou bateria baixa, 'critical' se nível < 15% ou offline.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              statusSummary: { type: Type.STRING },
              safetyTip: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              sentiment: { 
                type: Type.STRING, 
                enum: ['positive', 'warning', 'critical'] 
              },
            },
            required: ["statusSummary", "safetyTip", "recommendation", "sentiment"],
          },
        },
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Insight Error:", error);
      // Fallback in case of API error or rate limits
      return {
        statusSummary: "Sistema operando normalmente.",
        safetyTip: "Mantenha o botijão em local ventilado.",
        recommendation: status.level < 20 ? "Considere pedir uma recarga em breve." : "Nenhum ação necessária.",
        sentiment: status.level < 20 ? "warning" : "positive"
      };
    }
  }
};
