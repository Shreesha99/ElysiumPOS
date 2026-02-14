import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, CartItem, BusinessInsight } from "../types";

export const geminiService = {
  /**
   * Generates upselling suggestions based on the current cart.
   */
  async getUpsellSuggestions(cartItems: CartItem[], menu: MenuItem[]): Promise<string[]> {
    if (cartItems.length === 0) return [];
    
    // Create instance inside the method to avoid top-level "missing API key" errors during module load
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as a world-class restaurant consultant and data scientist. Analyze these daily restaurant metrics: ${JSON.stringify(salesData)}. 
        Generate 6-8 deep, actionable business insights. 
        Focus on:
        1. Revenue optimization (pricing, upselling).
        2. Operational efficiency (staffing, table turnover).
        3. Menu performance (engineering, popularity).
        4. Customer retention strategies.
        
        Return in JSON format with title, value, trend, description, category, and impact.`,
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
                description: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['Revenue', 'Operations', 'Menu', 'Customer'] },
                impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
              },
              required: ['title', 'value', 'trend', 'description', 'category', 'impact']
            }
          }
        }
      });
      const jsonStr = response.text?.trim() || '[]';
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Failed to get business insights:", error);
      return [];
    }
  }
};