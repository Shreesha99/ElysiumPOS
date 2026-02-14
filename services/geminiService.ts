import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, CartItem, BusinessInsight } from "../types";

/**
 * Deterministically retrieves the Gemini AI client.
 * Performs strict validation on the environment variable to prevent phantom "Key Missing" errors.
 */
const getAIClient = () => {
  // Access the injected environment variable
  const apiKey = process.env.API_KEY;
  
  // Strict multi-point validation
  const isInvalid = !apiKey || 
                    apiKey === "API_KEY" || 
                    apiKey === "undefined" || 
                    apiKey === "" || 
                    apiKey.includes("YOUR_API_KEY");

  if (isInvalid) {
    console.error("Elysium Core: API_KEY is missing or invalid in current environment node.");
    return null;
  }
  
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Elysium Core: Critical initialization failure", e);
    return null;
  }
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
      console.error("Elysium Core: Upsell Node Error", error);
      return [];
    }
  },

  /**
   * Generates business insights based on REAL user metrics.
   */
  async getBusinessInsights(salesData: any): Promise<BusinessInsight[]> {
    const ai = getAIClient();
    
    if (!ai) {
      throw new Error("API_KEY_MISSING");
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a world-class restaurant strategy consultant. Analyze these specific business metrics: 
        Revenue: ₹${salesData.revenue}
        Occupancy: ${salesData.occupancy}%
        Staff: ${salesData.staff}
        Menu Items: ${salesData.menuItems}
        Pending: ${salesData.pendingOrders}
        
        Generate 6-8 actionable business insights in JSON format (title, value, trend, description, category, impact).`,
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
      if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
        throw new Error("QUOTA_EXHAUSTED");
      }
      throw error;
    }
  }
};