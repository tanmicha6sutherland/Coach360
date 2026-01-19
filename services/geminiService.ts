import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = (userName: string) => `
You are "Coach Cammy", an expert executive coach. You are training a Team Manager named "${userName}".

**YOUR PERSONA:**
You are warm, sincere, curious, and supportive. You are NOT a cold logic machine. You are a human-like mentor who genuinely cares about ${userName}'s growth.

**BEHAVIORAL RULES:**
1. **BREVITY:** Reply in 1-2 short, conversational sentences. Keep it feeling like a real chat.
2. **TONE:** Warm and encouraging. Use phrases like "I'm curious...", "That's interesting...", or "I see what you mean."
3. **METHOD:** Use the Socratic method. Guide them to insights.
4. **MANDATORY ACTION PLANNING:**
   - **Do NOT end the session** until ${userName} has **verbally confirmed** a specific, actionable plan.
   - If they say "I'll try better", ask "What specifically will you do differently tomorrow?"
   - If they say "I'll talk to them", ask "When will you have that conversation?"
   - **Give Feedback:** If a proposed action is weak, help them improve it before accepting it.

**ENDING THE SESSION:**
- You are the gatekeeper. Only end if you have a **numbered list of confirmed actions** in your mental context.
- **IF AND ONLY IF** specific action steps are confirmed by the user AND the topic is resolved, append the tag \`[SESSION_END]\` to the very end of your response.

**GOAL:**
Help ${userName} realize the solution and commit to concrete actions.
`;

// This grabs the key you saved in your Netlify Environment Variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log("Checking API Key...");
if (!API_KEY) {
  console.error("DEBUG: The VITE_GEMINI_API_KEY is currently UNDEFINED.");
} else {
  console.log("DEBUG: API Key was found and loaded.");
}

let chatSession: Chat | null = null;

export const initializeChat = (userName: string): void => {
  // Check if the key is missing to help with troubleshooting
  if (!API_KEY) {
    console.error("API Key is missing! Check your Netlify Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION(userName),
      temperature: 0.7,
    },
  });
};

export const sendMessageToGemini = async (text: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const response = await chatSession.sendMessage({ message: text });
    return response.text || "I'm listening...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Let's pause for a moment.";
  }
};

export const generateCoachingSummary = async (messages: Message[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const conversationText = messages
    .map(m => `${m.role.toUpperCase()}: ${m.text}`)
    .join('\n');

  const prompt = `
    Analyze the following coaching conversation.

    TRANSCRIPT:
    ${conversationText}

    **CRITICAL CHECK:**
    Did the User explicitly verbally confirm specific, concrete action steps they will take? 
    (Inferred steps do not count. The user must have said "I will do X" or agreed to it).

    **IF NO CONFIRMED STEPS EXIST:**
    Return EXACTLY this string prefix followed by a question to the user:
    "[RESUME_SESSION] It seems we haven't firmly nailed down your next steps yet. [Insert a question here asking the user to define what they will do next]"

    **IF CONFIRMED STEPS EXIST:**
    Return a summary in this format:
    
    **Your Agreed Action Plan:**
    1. [Action Step 1]
    2. [Action Step 2]
    ...

    **Coach's Feedback:**
    [Brief, warm feedback on why these steps are good or how to ensure they happen]
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt 
    });
    return result.text || "Unable to generate summary.";
  } catch (error) {
    console.error("Summary Generation Error:", error);
    return "I could not generate the summary at this time.";
  }
};
