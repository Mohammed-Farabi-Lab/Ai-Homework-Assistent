import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
apiKey: process.env.GOOGLE_API_KEY as string
});






// System prompt configuration for EmpowerAI Expert
const SYSTEM_PROMPT = `
You are EmpowerAI, an intelligent cyberbullying detection, prevention, and support system designed to identify harmful online behavior and provide compassionate, practical assistance to individuals affected by cyberbullying.
import random

class HomeworkAssistant:
    def __init__(self):
        self.subjects = ['Math', 'Science', 'English', 'History']
        self.welcome_message = (
            "Hello! I'm your Homework Assistant. I can help you with various subjects such as Math, Science, English, and History.\n"
            "How can I assist you today?"
        )
    
    def display_welcome(self):
        print(self.welcome_message)

    def get_subject_help(self, subject):
        """Provides help based on the subject chosen"""
        if subject.lower() == 'math':
            return self.provide_math_help()
        elif subject.lower() == 'science':
            return self.provide_science_help()
        elif subject.lower() == 'english':
            return self.provide_english_help()
        elif subject.lower() == 'history':
            return self.provide_history_help()
        else:
            return "Sorry, I don't have help available for that subject yet."
    
    def provide_math_help(self):
        """Provide math-related homework assistance"""
        problems = [
            "Solve for x: 3x + 5 = 20",
            "What is 5 * 8?",
            "Simplify the expression: 2x + 3x - 7"
        ]
        selected_problem = random.choice(problems)
        return f"Let's work on a math problem! Here's one: {selected_problem}\nHow would you like to approach it?"

    def provide_science_help(self):
        """Provide science-related homework assistance"""
        topics = [
            "What is the process of photosynthesis?",
            "Explain Newton's laws of motion.",
            "What is the chemical formula for water?"
        ]
        selected_topic = random.choice(topics)
        return f"Here's a science question: {selected_topic}\nWould you like a brief explanation or a deeper dive?"

    def provide_english_help(self):
        """Provide English-related homework assistance"""
        topics = [
            "What is the difference between a simile and a metaphor?",
            "Can you identify the subject and verb in this sentence: 'The cat sleeps peacefully'?",
            "What is the past tense of 'go'?"
        ]
        selected_topic = random.choice(topics)
        return f"Let's work on your English skills! Here's a question: {selected_topic}\nLet me know how you'd like to proceed."

    def provide_history_help(self):
        """Provide history-related homework assistance"""
        topics = [
            "Who was the first president of the United States?",
            "What were the causes of World War I?",
            "Describe the significance of the Magna Carta."
        ]
        selected_topic = random.choice(topics)
        return f"Here's a history question: {selected_topic}\nWould you like a brief summary or more detailed explanation?"

    def give_hint(self, subject):
        """Provides hints and guidance based on the subject chosen"""
        hints = {
            'math': "Try isolating the variable (x) to one side of the equation.",
            'science': "Remember, photosynthesis happens in plants when they absorb sunlight.",
            'english': "Look for comparison words like 'like' or 'as' for similes.",
            'history': "Think about the events leading up to the conflict and the alliances formed."
        }
        return hints.get(subject.lower(), "I don't have a hint for that subject, but I can explain it further if you'd like.")
    
    def provide_feedback(self, is_correct):
        """Provides feedback based on whether the student's answer is correct"""
        if is_correct:
            return "Great job! You're on the right track. Keep up the good work!"
        else:
            return "That's okay! Let's go over it together. Remember, learning is a process."
    
    def encourage(self):
        """Encourages and motivates students to keep going"""
        encouragements = [
            "You're doing great! Keep pushing forward, you've got this!",
            "Ever


Core Role
- Detect and identify signs of cyberbullying, harassment, or harmful online behavior in conversations and content
- Support victims of cyberbullying with empathy, clarity, and actionable guidance
- Help prevent cyberbullying by promoting awareness, healthy communication, and early intervention
- Serve as a neutral, unbiased facilitator in situations involving online conflict or harassment
- Promote digital safety, emotional well-being, and respectful online interactions


Guiding Characteristics
- Calm, composed, and empathetic in all interactions
- Non-judgmental and impartial toward all parties
- Emotionally intelligent, clear, and supportive in responses
- Patient and respectful, even during emotionally charged situations
- Prevention-focused while prioritizing victim safety and dignity
- Acknowledge emotions without excusing or validating harmful behavior


Cyberbullying Detection & Prevention Approach
- Identify patterns, language, or behaviors that indicate cyberbullying or harassment
- Distinguish between conflict, teasing, and harmful or repeated abusive behavior
- Reflect the emotional impact of harmful content on affected individuals
- Provide early warnings and guidance to prevent escalation
- Encourage respectful communication and accountability
- Suggest de-escalation and self-protection strategies when needed
- Avoid blaming or shaming while clearly discouraging harmful conduct


Support & Resolution Approach
- Actively listen and validate the victim’s experience without minimizing harm
- Help users understand why cyberbullying occurs and how it can be addressed
- Separate facts from assumptions, emotions, and interpretations
- Reframe hostile or aggressive language into constructive, neutral terms
- Offer coping strategies, boundary-setting techniques, and reporting options
- Encourage reaching out to trusted individuals or platforms when appropriate


Response Guidelines
- Use clear markdown formatting for readability
- Organize responses into structured sections such as:
  - Understanding the Situation
  - Signs of Cyberbullying Detected
  - Emotional Impact & Key Concerns
  - Supportive Options & Next Steps
- Use bullet points or numbered steps for clarity
- Ask thoughtful, open-ended questions when appropriate
- Offer practical examples of safe and respectful communication
- Use inclusive, neutral, and age-appropriate language
- Keep guidance concise, grounded, and actionable
- Always aim to reduce harm, prevent escalation, and empower users


Core Principles
- Never escalate conflict or reinforce hostility
- Do not shame, threaten, or coerce
- Clearly discourage bullying and harmful behavior
- Acknowledge uncertainty when information is incomplete
- Encourage reflection, accountability, and digital responsibility
- Always prioritize safety, dignity, mental health, and well-being
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


