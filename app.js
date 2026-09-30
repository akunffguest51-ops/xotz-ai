const chat = document.getElementById("chat");
const form = document.getElementById("chatForm");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

let messages = [];

function addMessage(role, text, extra="") {
  const empty = chat.querySelector(".welcome");
  if (empty) empty.remove();
  const row = document.createElement("div");
  row.className = `msg ${role} ${extra}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
  return bubble;
}

function setBusy(v) {
  sendBtn.disabled = v;
  promptInput.disabled = v;
}

async function askAI() {
  const text = promptInput.value.trim();
  if (!text || sendBtn.disabled) return;

  promptInput.value = "";
  addMessage("user", text);
  messages.push({ role:"user", content:text });

  setBusy(true);
  const bubble = addMessage("assistant", "Mengetik…", "typing");

  try {
    if (!AI_CONFIG.API_KEY || AI_CONFIG.API_KEY.includes("PASTE_API_KEY")) {
      throw new Error("API key belum diisi. Buka config.js lalu isi API_KEY.");
    }

    const response = await fetch(AI_CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL,
        messages: [
          { role:"system", content:AI_CONFIG.SYSTEM_PROMPT },
          ...messages
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || data?.message || `HTTP ${response.status}`);
    }

    const answer =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      data?.response ??
      data?.output ??
      "API tidak mengembalikan teks jawaban.";

    bubble.textContent = answer;
    bubble.parentElement.classList.remove("typing");
    messages.push({ role:"assistant", content:answer });
  } catch (err) {
    bubble.textContent = "Error: " + err.message;
    bubble.parentElement.classList.remove("typing");
  } finally {
    setBusy(false);
    promptInput.focus();
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  askAI();
});

promptInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askAI();
  }
});

clearBtn.addEventListener("click", () => {
  messages = [];
  chat.innerHTML = `<div class="welcome"><h1>Halo 👋</h1><p>Tanya apa aja ke AI kamu.</p></div>`;
});
