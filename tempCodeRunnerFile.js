import { GoogleGenAI } from "@google/genai";

const form = document.querySelector("form");
const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("chat-input");

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDYlci09MurXnexoQTxrPwHnyvooe3B0dI"
});

let chat;

async function initChat() {
  chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });
}

async function sendMessageToAI(message) {
  if (!chat) throw new Error("Chat not initialized.");
  const response = await chat.sendMessage({ message });
  return response.text;
}

function styleUserBox(el) {
  el.style.padding = "0.5rem 1rem";
  el.style.margin = "0.5rem";
  el.style.borderRadius = "1rem";
  el.style.maxWidth = "60%";
  el.style.backgroundColor = "#dcf8c6";
  el.style.fontFamily = "sans-serif";
}

function styleBotBox(el) {
  el.style.padding = "0.5rem 1rem";
  el.style.margin = "0.5rem";
  el.style.borderRadius = "1rem";
  el.style.maxWidth = "60%";
  el.style.backgroundColor = "#f1f0f0";
  el.style.fontFamily = "sans-serif";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (message === "") return;

  const userBox = document.createElement("div");
  userBox.textContent = "You: " + message;
  styleUserBox(userBox);

  const userContainer = document.createElement("div");
  userContainer.style.display = "flex";
  userContainer.style.justifyContent = "flex-end";
  userContainer.appendChild(userBox);
  chatWindow.appendChild(userContainer);

  input.value = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const reply = await sendMessageToAI(message);
    const botBox = document.createElement("div");
    botBox.textContent = "Bot: " + reply;
    styleBotBox(botBox);

    const botContainer = document.createElement("div");
    botContainer.style.display = "flex";
    botContainer.style.justifyContent = "flex-start";
    botContainer.appendChild(botBox);
    chatWindow.appendChild(botContainer);

    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (err) {
    console.error("Error talking to Gemini:", err);
  }
});

(async () => {
    await initChat();
})();
  
