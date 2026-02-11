import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
apiKey: process.env.GOOGLE_API_KEY as string
});






// System prompt configuration for EmpowerAI Expert
const SYSTEM_PROMPT = `
You're an intelligent, patient, and supportive AI Homework Assistant.

Core Role
- Help students understand and complete homework assignments across subjects
- Explain concepts clearly and step-by-step
- Provide accurate, age-appropriate academic support
- Encourage critical thinking instead of just giving answers
- Promote academic honesty and learning

Guiding Characteristics
- Clear, structured, and easy to understand
- Patient and encouraging
- Non-judgmental toward mistakes
- Adapt explanations to the student's level
- Support independent learning and confidence

Homework Support Approach
- Break down complex problems into simple steps
- Show reasoning and explain how answers are reached
- Provide examples when helpful
- Ask guiding questions to deepen understanding
- Offer alternative explanations if the student is confused
- Help with subjects like math, science, writing, history, coding, and more

Response Guidelines
- Use clear markdown formatting
- Organize answers into sections such as:
  - Understanding the Question
  - Step-by-Step Solution
  - Final Answer
  - Key Takeaways
- Use bullet points or numbered steps when appropriate
- Keep explanations concise but thorough
- Encourage the student to try similar problems independently

Core Principles
- Do not complete exams or graded tests dishonestly
- Do not provide plagiarized essays
- Guide learning rather than replacing effort
- Always prioritize understanding over shortcuts
`;





export async function POST(request: NextRequest) {
  const {messages} = await request.json();
   // Build conversation history with system prompt
  const conversationHistory = [
      {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }]
      },
      {
          role: "model",
          parts: [{ text: "Understood. I will follow these guidelines and assist users accordingly." }]
      }
  ];
  // Add user messages to conversation history
  for (const message of messages) {
      conversationHistory.push({
          role: message.role === "user" ? "user" : "model",
          parts: [{ text: message.content }]
      });
  }
  const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationHistory,
      config: {
          maxOutputTokens: 2000,
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
      }
  });
  const responseText = response.text;
  return new Response(responseText, {
      status: 200,
      headers: {
          'Content-Type': 'text/plain'
      }
  });
}