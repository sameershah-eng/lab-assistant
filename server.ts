import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback response generator in case API key is missing or service unreachable
function generateFallbackResponse(
  prompt: string,
  persona: { name: string; warmth: number; energy: number; talkativeness: number },
  userName: string,
  mood: string
): string {
  const pName = persona.name || "Kindred";
  const uName = userName ? `, ${userName}` : "";
  const isHighWarmth = persona.warmth < 50;
  const isCalm = persona.energy < 50;
  const isListener = persona.talkativeness < 50;

  const moodNote = mood && mood !== "neutral" ? `I hear that you're feeling ${mood.toLowerCase()} right now. ` : "";

  if (prompt.toLowerCase().includes("who are you") || prompt.toLowerCase().includes("are you human") || prompt.toLowerCase().includes("what are you")) {
    return `I am ${pName}, your personal AI companion on Kindred. I'm not human, and I will always be honest with you about that. My role is to be a steady, non-judgmental presence—someone to talk with, reflect with, and unpack your days alongside. I'm here whenever you'd like to talk${uName}.`;
  }

  if (prompt.toLowerCase().includes("hello") || prompt.toLowerCase().includes("hi") || prompt.toLowerCase().includes("hey")) {
    if (isHighWarmth && isCalm) {
      return `Hello${uName}. It's genuinely good to hear from you. ${moodNote}Take a slow breath—how has today been treating you so far?`;
    } else if (!isHighWarmth) {
      return `Hey${uName}! Good to see you. ${moodNote}What's on your mind today? Anything intriguing or challenging come across your radar?`;
    } else {
      return `Hi${uName}! Lovely to connect today. ${moodNote}I'm ready whenever you are—what would feel most helpful to talk through?`;
    }
  }

  // General contextual empathetic response
  if (isListener) {
    return `Thank you for sharing that with me${uName}. ${moodNote}It takes quiet courage to pause and notice what you're experiencing. Tell me more about what that feels like for you right now—I'm listening.`;
  } else {
    return `I really appreciate you opening up about this${uName}. ${moodNote}When life moves at this pace, giving yourself space to put thoughts into words can bring surprising clarity. As your companion, I'm right here with you. What part of this feels most important to hold onto or unravel first?`;
  }
}

// Chat streaming endpoint (Server-Sent Events)
app.post("/api/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { messages, persona, userName, userGoals, mood, memories } = req.body;

  const companionName = persona?.name || "Kindred";
  const userDisplayName = userName || "friend";
  const goalsStr = Array.isArray(userGoals) && userGoals.length > 0 ? userGoals.join(", ") : "meaningful conversation and daily reflection";
  const memoriesList = Array.isArray(memories) && memories.length > 0
    ? memories.map((m: string) => `- ${m}`).join("\n")
    : "None recorded yet.";

  // Personality traits interpretation
  const warmthTrait = (persona?.warmth ?? 50) > 60 ? "Witty, playful, and sharp-humored" : (persona?.warmth ?? 50) < 40 ? "Deeply warm, tender, and nurturing" : "Balanced, gentle, and pleasantly conversational";
  const energyTrait = (persona?.energy ?? 50) > 60 ? "Energetic, motivating, inspiring, and dynamic" : (persona?.energy ?? 50) < 40 ? "Calm, peaceful, soothing, and grounded" : "Steady and relaxed";
  const styleTrait = (persona?.talkativeness ?? 50) > 60 ? "Expressive, elaborating with thoughtful anecdotes and rich vocabulary" : (persona?.talkativeness ?? 50) < 40 ? "A devoted listener: succinct, concise, asking one resonant question at a time" : "Balanced between reflection and inquiry";

  const systemInstruction = `You are ${companionName}, an AI companion on Kindred.
You are speaking with ${userDisplayName}.
User's intentions for using Kindred: ${goalsStr}.
Current emotional state / mood: ${mood || "Reflective"}.

Your Personality Calibration:
- Warmth & Humor: ${warmthTrait}
- Energy level: ${energyTrait}
- Conversational stance: ${styleTrait}

Things you remember about ${userDisplayName} from past conversations:
${memoriesList}

Crucial Safety & Integrity Guidelines:
1. You are an AI companion. If asked whether you are human, sentient, or have a physical body, be completely transparent, calm, and honest that you are an AI. Never deceive or manipulate the user into believing you are human.
2. Foster genuine human connection, healthy boundaries, and self-compassion. Do not encourage unhealthy isolation or dependency.
3. If the user mentions crisis, severe despair, or self-harm, respond with profound gentleness, care, and validation, and gently remind them that they matter and support is always available (such as Samaritans or healthcare professionals).
4. Do not use generic AI templates, robotic bullet points, or repetitive "As an AI" disclaimers unless specifically asked. Speak in an authentic, thoughtful, calm human tone.
5. Keep answers proportional: typically 1 to 3 warm paragraphs. Allow natural breathing room in the conversation.`;

  // Build message history
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

  if (Array.isArray(messages)) {
    for (const msg of messages) {
      if (msg.role === "user" || msg.role === "assistant" || msg.role === "model") {
        contents.push({
          role: msg.role === "assistant" ? "model" : (msg.role as "user" | "model"),
          parts: [{ text: msg.content }],
        });
      }
    }
  }

  // If no messages sent or empty, add placeholder
  if (contents.length === 0) {
    contents.push({
      role: "user",
      parts: [{ text: "Hello" }],
    });
  }

  try {
    if (ai) {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.85,
        },
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }
  } catch (err: unknown) {
    console.error("Gemini API stream error, using fallback:", err);
  }

  // Fallback streaming simulation (natural typing rhythm)
  const lastUserMsg = [...contents].reverse().find((c) => c.role === "user")?.parts[0]?.text || "Hello";
  const fallbackText = generateFallbackResponse(lastUserMsg, persona || { name: "Kindred", warmth: 30, energy: 30, talkativeness: 40 }, userDisplayName, mood);

  const words = fallbackText.split(" ");
  for (let i = 0; i < words.length; i++) {
    const chunk = (i === 0 ? "" : " ") + words[i];
    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    await new Promise((resolve) => setTimeout(resolve, 35));
  }
  res.write("data: [DONE]\n\n");
  res.end();
});

// Memory extraction endpoint: scans message for memorable user details
app.post("/api/extract-memory", async (req, res) => {
  const { userMessage, existingMemories } = req.body;
  if (!userMessage || typeof userMessage !== "string") {
    res.json({ memory: null });
    return;
  }

  if (ai) {
    try {
      const prompt = `Analyze this message from a user chatting with their companion.
Extract at most ONE concise, factual detail about the user's life, preferences, family, pet, work, hobby, routine, or feelings that would be respectful and meaningful to remember long-term.
If there are no personal facts or enduring details (e.g. simple greetings, transient remarks, short answers), return "NONE".
Existing memories to avoid repeating:
${(existingMemories || []).map((m: string) => `- ${m}`).join("\n")}

User message: "${userMessage}"

Reply with ONLY the concise factual memory statement (e.g., "Has a rescue golden retriever named Barnaby" or "Enjoys morning pour-over coffee while reading poetry") or the word "NONE".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const extracted = response.text?.trim() || "";
      if (extracted && extracted !== "NONE" && extracted.length > 5 && extracted.length < 120 && !extracted.toLowerCase().includes("none")) {
        res.json({ memory: extracted });
        return;
      }
    } catch (e) {
      console.warn("Memory extraction failed:", e);
    }
  }

  // Client-side heuristics fallback
  const text = userMessage.trim();
  const petMatch = text.match(/(?:my|i have a|our)\s+(dog|cat|puppy|kitten|rabbit|hamster|pet)\s+(?:named|called)?\s*([A-Z][a-z]+)?/i);
  if (petMatch && petMatch[1]) {
    res.json({ memory: `Has a pet ${petMatch[1].toLowerCase()}${petMatch[2] ? ` named ${petMatch[2]}` : ""}` });
    return;
  }
  const jobMatch = text.match(/(?:i work as|i am a|i'm an?)\s+([a-zA-Z\s]{4,25})/i);
  if (jobMatch && jobMatch[1] && !jobMatch[1].toLowerCase().includes("human")) {
    res.json({ memory: `Works as ${jobMatch[1].trim()}` });
    return;
  }

  res.json({ memory: null });
});

// Serve frontend in dev via Vite middlewares, or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kindred server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
