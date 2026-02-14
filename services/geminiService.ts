import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, CartItem, BusinessInsight } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "API_KEY" || apiKey === "undefined") {
    console.warn("Gemini API Key is missing. Please set the API_KEY environment variable.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const MOCK_INSIGHTS: BusinessInsight[] = [
  {
    title: "Table Turnover Optimization",
    value: "+18% Potential",
    trend: "up",
    description: "Average dining duration for Table 4 is 25% higher than the house average. Suggesting a dessert-only menu for late-session guests to optimize flow.",
    category: "Operations",
    impact: "High"
  },
  {
    title: "High-Margin Pairing",
    value: "₹2,450/day",
    trend: "up",
    description: "The 'Truffle Mushroom Arancini' is frequently ordered without a beverage. Automated upselling of the 'Craft Lager' could increase category revenue significantly.",
    category: "Revenue",
    impact: "Medium"
  },
  {
    title: "Inventory Leakage Alert",
    value: "Critical",
    trend: "down",
    description: "Wagyu beef stock is depleting faster than registered orders suggest. Recommend an immediate physical audit of the cold storage node.",
    category: "Menu",
    impact: "High"
  },
  {
    title: "Customer Loyalty Peak",
    value: "72% Retention",
    trend: "up",
    description: "Weekend evening traffic shows a strong preference for 'Chilean Sea Bass'. Consider a loyalty 'Sea Bass Tasting' event to reward top spenders.",
    category: "Customer",
    impact: "Medium"
  },
  {
    title: "Staff Load Balancing",
    value: "Optimized",
    trend: "neutral",
    description: "Arjun Mehta is currently handling 40% more volume than other staff. Consider reassignment of T1 and T2 to balance the service load.",
    category: "Operations",
    impact: "Medium"
  },
  {
    title: "Dynamic Pricing Window",
    value: "15:00 - 17:00",
    trend: "down",
    description: "Revenue dips during mid-afternoon. Implement a 'Happy Hour' logic for the Specials category to maximize idle kitchen capacity.",
    category: "Revenue",
    impact: "Low"
  }
];

export const geminiService = {
  /**
   * Generates upselling suggestions based on the current cart.
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
      console.error("Upsell AI Error:", error);
      return [];
    }
  },

  /**
   * Generates business insights based on simulated sales data.
   */
  async getBusinessInsights(salesData: any): Promise<BusinessInsight[]> {
    const ai = getAIClient();
    if (!ai) {
      console.warn("No API key - falling back to Mock Strategy Data.");
      return MOCK_INSIGHTS;
    }

    try {
      // Switching to gemini-3-flash-preview for significantly higher rate limits (RPM/RPD)
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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
    } catch (error: any) {
      console.error("AI Insight Core Error:", error);
      
      // Handle Rate Limit (429) specifically or any other error by falling back to mock data
      // This ensures the user experience isn't broken during a demo or key exhaustion.
      if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
        console.warn("Quota Exhausted. Activating Fallback Strategy Nodes.");
        throw new Error("QUOTA_EXHAUSTED");
      }
      
      throw error;
    }
  },

  /**
   * Provides the mock data directly if needed for testing or fallback
   */
  getMockInsights(): BusinessInsight[] {
    return MOCK_INSIGHTS;
  }
};