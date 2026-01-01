
import { GoogleGenAI } from "@google/genai";

/**
 * Generates an optimized AI prompt using Gemini 3 Flash.
 * @param topic The user's intended task or topic.
 * @param toolType The category of the tool (Image, Chat, Code, etc).
 */
export const generatePrompt = async (topic: string, toolType: string): Promise<string> => {
  try {
    // Initializing GoogleGenAI with process.env.API_KEY directly as per SDK requirements
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User wants a prompt for an AI tool of type "${toolType}". Topic: "${topic}". 
      Task: Create a highly structured, expert-level prompt that includes context, specific constraints, and desired output format. 
      Limit response to ONLY the prompt text.`,
      config: {
        systemInstruction: "You are a professional Prompt Engineer. You write prompts that follow the 'Role, Context, Task, Constraint' framework to ensure peak AI performance.",
        temperature: 0.7,
        topP: 0.9,
      },
    });
    
    // Accessing the .text property directly from the response object
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return text.trim();
  } catch (error: any) {
    console.error("Gemini Prompt Generation Error:", error);
    
    // Graceful error messaging for production
    if (error?.message?.includes('429')) {
      return "The system is currently busy. Please wait a moment and try again.";
    }
    
    if (error?.message?.includes('403') || error?.message?.includes('401')) {
      return "Authentication error. The system administrator needs to check the API key configuration.";
    }
    
    return "Something went wrong while crafting your prompt. Please try again with different keywords.";
  }
};
