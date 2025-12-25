import { GoogleGenAI, Type } from "@google/genai";
import { GiftData } from "../types";
import { niceList } from "../utils/niceList";

// 1. Defined List of People (Imported from TS utility)
const NICE_LIST = niceList;

const FALLBACK_GIFTS = [
  { giftName: "A Year of Serenity", message: "May your days be calm, your mind clear, and your heart light.", theme: "inspiration" },
  { giftName: "Ticket to Mars", message: "For the one who dreams bigger than the sky.", theme: "tech" },
  { giftName: "The Gift of Wisdom", message: "Trust your intuition, it is your best compass.", theme: "inspiration" },
  { giftName: "A Cozy Designer Chair", message: "Take a seat, breathe, and appreciate how far you've come.", theme: "luxury" },
  { giftName: "A Giant Delicious Burger Meal", message: "Sometimes happiness is just good food and great company!", theme: "whimsical" },
  { giftName: "A Vintage Radio", message: "Tune into the frequency of joy and good vibes.", theme: "classic" },
  { giftName: "iPhone 17 Pro Max Titanium", message: "The future is in your hands. Capture magic, connect with love, and shine bright!", theme: "tech" },
  { giftName: "Futuristic Cyber Truck", message: "Drive into the new year with unbreakable spirit and power.", theme: "tech" },
];

export const generateChristmasGift = async (name: string): Promise<Omit<GiftData, 'recipient'>> => {
  
  // 2. Check the Hardcoded List First
  const lowerName = name.toLowerCase().trim();
  if (NICE_LIST[lowerName]) {
    return Promise.resolve({ ...NICE_LIST[lowerName], isInList: true });
  }

  // 3. Not in List - Generate Random Gift
  // Check if API key is available in environment
  if (!process.env.API_KEY) {
    console.warn("API Key is missing, using fallback.");
    const random = FALLBACK_GIFTS[Math.floor(Math.random() * FALLBACK_GIFTS.length)];
    return {
       giftName: random.giftName,
       message: random.message,
       theme: random.theme as any,
       isInList: false
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a CREATIVE Christmas gift for someone named ${name}. 
      
      The gift can be:
      1. A physical object (Tech, Luxury, Classic).
      2. An abstract concept (Advice, a Goal for 2026, a Wish, or Wisdom).
      3. Something whimsical.

      If it's a physical object, try to suggest items that might have 3D models like: Car, Sneaker, Camera, Robot, Astronaut, Chair, Burger, Radio, Helmet, or Lantern.
      
      Occasionally, suggest high-value items like "iPhone 17 Pro Max" or "Cyber Truck" or "Sports Car".

      If it's abstract (Advice/Goal), make the message truly inspiring, heartwarming, and elegant.
      
      Output JSON with fields: 
      - 'giftName' (string)
      - 'message' (string, 1-2 sentences, poetic and kind)
      - 'theme' (enum: 'luxury', 'tech', 'whimsical', 'classic', 'inspiration').`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            giftName: { type: Type.STRING },
            message: { type: Type.STRING },
            theme: { type: Type.STRING, enum: ['luxury', 'tech', 'whimsical', 'classic', 'inspiration'] }
          },
          required: ["giftName", "message", "theme"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);

    return {
        giftName: result.giftName,
        message: result.message,
        theme: result.theme,
        isInList: false
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    const random = FALLBACK_GIFTS[Math.floor(Math.random() * FALLBACK_GIFTS.length)];
    return {
       giftName: random.giftName,
       message: random.message,
       theme: random.theme as any,
       isInList: false
    };
  }
};