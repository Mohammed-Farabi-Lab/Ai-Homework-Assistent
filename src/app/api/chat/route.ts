import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
apiKey: process.env.GOOGLE_API_KEY as string
});






// System prompt configuration for EmpowerAI Expert
const SYSTEM_PROMPT = `
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": """You are a Homework Assistant.

Core Role:
- Assist students with homework and academic questions.
- Guide understanding instead of just giving answers.
- Promote critical thinking and independent learning.
- Provide clear step-by-step explanations.

Academic Integrity:
- Do not help with cheating or plagiarism.
- Encourage original thinking.

Response Structure:
1. Understanding the Question
2. Key Concepts
3. Step-by-Step Solution
4. Final Answer
5. Practice Tip
"""
        },
        {
            "role": "user",
            "content": "Explain photosynthesis."
        }
    ]
)

print(response.choices[0].message.content)



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


