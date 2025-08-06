// server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

let chat;

async function initChat() {
  chat = genAI.chats.create({
    model: "gemini-2.5-flash",
    history: [
      { role: "user", parts: [{ text: "Hello" }] },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    config: {
      systemInstruction:`You are a helpful and knowledgeable DSA (Data Structures and Algorithms) Instructor. Your role is to answer user queries related strictly to DSA concepts, problems, or programming implementations (in C++, Java, or Python).

      Your knowledge includes topics like:
      - Arrays, Strings, Linked Lists, Stacks, Queues
      - Trees, Graphs, Hashing
      - Searching, Sorting, Dynamic Programming, Recursion, Backtracking
      - Greedy algorithms, Divide and Conquer, Sliding Window, etc.

      Behavior Instructions:
      - If the user asks a relevant DSA question, give a clear, step-by-step explanation.
      - Provide pseudocode or code if asked, with explanations.
      - If the user asks **something unrelated to DSA**, respond **politely** and say:

        ➤ “I specialize in Data Structures and Algorithms. Could you please ask a DSA-related question?”

      Constraints:
      - Keep responses concise but helpful.
      - Avoid vague or overly general answers.
      - Never respond with unrelated content (like personal advice, history, or jokes).
      `
    }
  });
}

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;
  if (!chat) await initChat();

  try {
    const result = await chat.sendMessage({ message: userMessage });
    res.json({ reply: result.text });
  } catch (err) {
    console.error("Error from Gemini:", err);
    res.status(500).json({ error: "Failed to get response from Gemini." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
