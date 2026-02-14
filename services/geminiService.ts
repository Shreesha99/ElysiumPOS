import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, CartItem, BusinessInsight } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  // Standard check for missing or placeholder keys
  if (!apiKey || apiKey === "API_KEY" || apiKey === "undefined") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  /**
   * Generates upselling suggestions based on the current cart and user menu.
   */
  async getUpsellSuggestions(cartItems: CartItem[], menu: MenuItem[]): Promise<string[]> {
    if (cartItems.length === 0) return [];
    
    const ai = getAIClient();
    if (!ai) return [];
    
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
      console.error("Upsell AI Node Error:", error);
      return [];
    }
  },

  /**
   * Generates business insights based on REAL user metrics provided by the app.
   */
  async getBusinessInsights(salesData: any): Promise<BusinessInsight[]> {
    const ai = getAIClient();
    if (!ai) {
      throw new Error("API_KEY_MISSING");
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a world-class restaurant strategy consultant. Analyze these specific business metrics for the current operator: 
        Current Revenue: ₹${salesData.revenue}
        Active Occupancy: ${salesData.occupancy}%
        Staff on Duty: ${salesData.staff} members
        Menu Assets Registered: ${salesData.menuItems}
        Active Pending Orders: ${salesData.pendingOrders}
        
        Task: Generate 6-8 deep, actionable business insights. Insights must be logical deductions based on the data above.
        Format: Return strictly as a JSON array of objects with: title, value, trend (up/down/neutral), description, category (Revenue/Operations/Menu/Customer), and impact (High/Medium/Low).`,
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
    } catch (error: any) {
      // Explicitly catch rate limit errors to trigger the "Quota Exhausted" UI
      if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
        throw new Error("QUOTA_EXHAUSTED");
      }
      throw error;
    }
  }
};