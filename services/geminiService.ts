import { GoogleGenAI } from "@google/genai";

/**
 * Generates an optimized AI prompt using Gemini 3 Flash.
 */
export const generatePrompt = async (topic: string, toolType: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: The user is looking for a high-quality prompt to use with an AI tool of category "${toolType}". 
      Input Goal: "${topic}".
      Task: Act as a master Prompt Engineer. Create a structured prompt following the Role-Context-Task-Constraint framework.
      Output: Provide ONLY the final prompt text. No introductory remarks.`,
      config: {
        systemInstruction: "You are an elite Prompt Engineer for SGAIVault. Your mission is to help users get the best output from AI tools listed in our directory by crafting precise, expert-level prompts.",
        temperature: 0.8,
        topP: 0.95,
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("Could not extract generated prompt.");
    
    return text.trim();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    if (error?.message?.includes('429')) {
      return "The Prompt Engine is experiencing high volume. Please try again in 30 seconds.";
    }
    
    return "Our Prompt Engine had a small hiccup. Please try rephrasing your goal slightly.";
  }
};