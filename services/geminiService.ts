import { GoogleGenerativeAI } from "@google/generative-ai";
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

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Log to see if the key is actually reaching the app
console.log("Checking API Key...");
if (!API_KEY) {
  console.error("DEBUG: The VITE_GEMINI_API_KEY is currently UNDEFINED.");
} else {
  console.log("DEBUG: API Key was found and loaded.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
let chatSession: any = null;

export const initializeChat = (userName: string): void => {
  // We use gemini-1.5-flash which is the standard, fast model.
  chatSession = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION(userName),
  }).startChat({
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
    return response.text() || "I'm listening...";
  } catch (error) {
    console.error("Gemini API Error Detail:", error);
    return "I'm having trouble connecting right now. Let's pause for a moment.";
  }
};

export const generateCoachingSummary = async (messages: Message[]): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const conversationText = messages
    .map(m => `${m.role.toUpperCase()}: ${m.text}`)
    .join('\n');

  const prompt = `
    Analyze the following coaching conversation.
    TRANSCRIPT:
    ${conversationText}

    Did the User explicitly verbally confirm specific, concrete action steps? 
    IF NO: Return "[RESUME_SESSION] It seems we haven't firmly nailed down your next steps yet. [Ask a question]"
    IF YES: Return a summary with "Your Agreed Action Plan" and "Coach's Feedback".
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "Unable to generate summary.";
  } catch (error) {
    console.error("Summary Generation Error:", error);
    return "I could not generate the summary at this time.";
  }
};
