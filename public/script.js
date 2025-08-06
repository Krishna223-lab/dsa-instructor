const form = document.querySelector("form");
const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("chat-input");

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
  userBox.style.fontWeight = "100";
  styleUserBox(userBox);
  userBox.style.boxShadow = "0 0 1rem rgba(0, 0, 0, 0.5)";

  const userContainer = document.createElement("div");
  userContainer.style.display = "flex";
  userContainer.style.justifyContent = "flex-end";
  userContainer.appendChild(userBox);
  chatWindow.appendChild(userContainer);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  input.value = "";

  const loadingBox = document.createElement("div");
  loadingBox.textContent = "Bot is typing";
  styleBotBox(loadingBox);
  loadingBox.style.fontStyle = "italic";
  loadingBox.style.opacity = "0.7";
  loadingBox.style.boxShadow = "0 0 1rem rgba(0, 0, 0, 0.5)";

  const loadingContainer = document.createElement("div");
  loadingContainer.style.display = "flex";
  loadingContainer.style.justifyContent = "flex-start";
  loadingContainer.appendChild(loadingBox);
  chatWindow.appendChild(loadingContainer);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  let dotCount = 0;
  const dotInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    loadingBox.textContent = "Bot is typing" + ".".repeat(dotCount);
  }, 500);

  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    clearInterval(dotInterval);
    chatWindow.removeChild(loadingContainer);

    const botBox = document.createElement("div");
    botBox.textContent = "Bot: " + data.reply.replace(/\*\*/g, "").replace(/\*/g, "");
    botBox.style.whiteSpace = "pre-wrap";
    botBox.style.fontWeight = "100";
    styleBotBox(botBox);
    botBox.style.boxShadow = "0 0 1rem rgba(0, 0, 0, 0.5)";

    const botContainer = document.createElement("div");
    botContainer.style.display = "flex";
    botContainer.style.justifyContent = "flex-start";
    botContainer.appendChild(botBox);
    chatWindow.appendChild(botContainer);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (err) {
    clearInterval(dotInterval);
    chatWindow.removeChild(loadingContainer);
    console.error("Fetch error:", err);
  }
});
