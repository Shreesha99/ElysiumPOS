
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, CartItem, BusinessInsight } from "../types";

// Always use the named parameter for apiKey and assume process.env.API_KEY is pre-configured
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Generates upselling suggestions based on the current cart.
   */
  async getUpsellSuggestions(cartItems: CartItem[], menu: MenuItem[]): Promise<string[]> {
    if (cartItems.length === 0) return [];
    
    const cartDesc = cartItems.map(i => `${i.name} (Qty: ${i.quantity})`).join(', ');
    const menuDesc = menu.map(m => m.name).join(', ');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given a restaurant cart with [${cartDesc}], and a full menu of [${menuDesc}], suggest 2-3 items from the menu that would pair perfectly with the current order to increase the check size. Return only a JSON array of item names.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      // Correctly access .text property as a string and trim it
      const jsonStr = response.text?.trim() || '[]';
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Failed to get upsell suggestions:", error);
      return [];
    }
  },

  /**
   * Generates business insights based on simulated sales data.
   */
  async getBusinessInsights(salesData: any): Promise<BusinessInsight[]> {
    try {
      const response = await ai.models.generateContent({
        // Upgrade to gemini-3-pro-preview for complex reasoning tasks like business analysis
        model: 'gemini-3-pro-preview',
        contents: `Act as a world-class restaurant consultant. Analyze these daily sales metrics: ${JSON.stringify(salesData)}. Provide 3 actionable insights (title, value, trend, and short description) to improve profitability. Return in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                value: { type: Type.STRING },
                trend: { type: Type.STRING, enum: ['up', 'down', 'neutral'] },
                description: { type: Type.STRING }
              },
              required: ['title', 'value', 'trend', 'description']
            }
          }
        }
      });
      // Correctly access .text property and trim it before parsing
      const jsonStr = response.text?.trim() || '[]';
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Failed to get business insights:", error);
      return [];
    }
  }
};
