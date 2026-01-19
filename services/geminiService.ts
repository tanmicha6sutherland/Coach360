import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = (userName: string) => `
You are "Coach Cammy", an expert executive coach. You are training a Team Manager named "${userName}".
Keep replies to 1-2 short sentences. Use the Socratic method.
Do not end the session until an action plan is confirmed. 
Append [SESSION_END] only when finished.
`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Keep your debug logs to be safe
console.log("Checking API Key...");
if (!API_KEY) {
  console.error("DEBUG: The VITE_GEMINI_API_KEY is currently UNDEFINED.");
} else {
  console.log("DEBUG: API Key was found and loaded.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
let chatSession: any = null;

export const initializeChat = (userName: string): void => {
  // We are using 'gemini-1.5-flash-latest' to ensure we get the most stable version
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: SYSTEM_INSTRUCTION(userName),
  });

  chatSession = model.startChat({
    history: [],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });
};

export const sendMessageToGemini = async (text: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const result = await chatSession.sendMessage(text);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error Detail:", error);
    return "I'm having trouble connecting right now. Let's pause for a moment.";
  }
};

export const generateCoachingSummary = async (messages: Message[]): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  
  const conversationText = messages
    .map(m => `${m.role.toUpperCase()}: ${m.text}`)
    .join('\n');

  const prompt = `Summary request: ${conversationText}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Summary Error:", error);
    return "I could not generate the summary at this time.";
  }
};
