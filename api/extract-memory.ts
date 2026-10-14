import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  const { userMessage, existingMemories } = body;

  if (!userMessage || typeof userMessage !== "string") {
    res.json({ memory: null });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

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
      console.warn("Memory extraction failed on Vercel:", e);
    }
  }

  // Heuristic fallback
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
}
