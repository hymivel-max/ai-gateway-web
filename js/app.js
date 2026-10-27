// AI Gateway Web Client - 100% Client-Side Engine for GitHub Pages
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const messagesContainer = document.getElementById("messagesContainer");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const modelSelect = document.getElementById("modelSelect");
  const providerBadge = document.getElementById("providerBadge");
  const badgeText = document.getElementById("badgeText");
  const clearChatBtn = document.getElementById("clearChatBtn");
  const exportChatBtn = document.getElementById("exportChatBtn");
  const newChatBtn = document.getElementById("newChatBtn");
  const chatHistoryList = document.getElementById("chatHistoryList");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const micBtn = document.getElementById("micBtn");

  // Mode buttons
  const modeChat = document.getElementById("modeChat");
  const modeCoding = document.getElementById("modeCoding");
  const modeImage = document.getElementById("modeImage");
  let currentMode = "chat"; // 'chat' | 'coding' | 'image'

  // Settings Modal Elements
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const closeSettingsBtn = document.getElementById("closeSettingsBtn");
  const saveSettingsBtn = document.getElementById("saveSettingsBtn");
  const resetDefaultsBtn = document.getElementById("resetDefaultsBtn");
  const settingEngine = document.getElementById("settingEngine");
  const geminiApiKey = document.getElementById("geminiApiKey");
  const groqApiKey = document.getElementById("groqApiKey");
  const openaiApiKey = document.getElementById("openaiApiKey");
  const customBaseUrl = document.getElementById("customBaseUrl");
  const systemPromptInput = document.getElementById("systemPromptInput");

  // State
  let conversations = JSON.parse(localStorage.getItem("ai_gateway_conversations") || "[]");
  let currentConversationId = localStorage.getItem("ai_gateway_active_convo_id") || null;
  let isGenerating = false;

  // Settings State
  let settings = JSON.parse(localStorage.getItem("ai_gateway_settings") || JSON.stringify({
    engine: "pollinations",
    geminiKey: "",
    groqKey: "",
    openaiKey: "",
    customUrl: "",
    systemPrompt: "You are an intelligent, helpful AI assistant. Provide concise, clean, and well-structured responses with markdown and code snippets."
  }));

  // URL query param check (e.g. ?model=deepseek-r1)
  const urlParams = new URLSearchParams(window.location.search);
  const requestedModel = urlParams.get("model");
  if (requestedModel) {
    const opt = Array.from(modelSelect.options).find(o => o.value === requestedModel);
    if (opt) {
      modelSelect.value = requestedModel;
    }
  }

  // Marked Configuration for Markdown rendering
  marked.setOptions({
    highlight: function(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
    breaks: true,
    gfm: true
  });

  // Initialize
  loadSettings();
  renderHistoryList();
  if (!currentConversationId || !getConversation(currentConversationId)) {
    startNewConversation();
  } else {
    loadConversation(currentConversationId);
  }
  updateBadge();

  // Mode Selection
  function setMode(mode) {
    currentMode = mode;
    [modeChat, modeCoding, modeImage].forEach(b => b.classList.remove("active"));
    if (mode === "chat") modeChat.classList.add("active");
    if (mode === "coding") modeCoding.classList.add("active");
    if (mode === "image") {
      modeImage.classList.add("active");
      modelSelect.value = "flux";
      chatInput.placeholder = "Describe the image you want to generate (e.g., 'A futuristic Kerala houseboat at sunset, 8k, hyper-detailed')...";
      updateBadge();
    } else {
      chatInput.placeholder = "Message your AI assistant or ask a coding question... (Press Enter to send)";
    }
  }

  modeChat.addEventListener("click", () => setMode("chat"));
  modeCoding.addEventListener("click", () => setMode("coding"));
  modeImage.addEventListener("click", () => setMode("image"));

  // Auto-expand Textarea
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 180) + "px";
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener("click", handleSend);

  // Send Message Logic
  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text || isGenerating) return;

    chatInput.value = "";
    chatInput.style.height = "auto";

    const activeModel = modelSelect.value;
    const convo = getConversation(currentConversationId);

    // If image mode, generate and display
    if (currentMode === "image" || activeModel === "flux") {
      appendUserMessage(text);
      convo.messages.push({ role: "user", content: text });
      saveConversations();

      const imageMsgId = appendAssistantMessage("Generating your AI image via FLUX.1...");
      const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?model=flux&width=1024&height=768&nologo=true&seed=${Math.floor(Math.random() * 999999)}`;
      
      const imgContainer = document.getElementById(imageMsgId);
      if (imgContainer) {
        imgContainer.innerHTML = `
          <p><strong>Prompt:</strong> <em>${escapeHtml(text)}</em></p>
          <img src="${imgUrl}" alt="${escapeHtml(text)}" class="ai-generated-image" loading="lazy">
          <p style="margin-top:0.5rem;"><a href="${imgUrl}" target="_blank" style="color:var(--accent-cyan); font-size:0.8rem;">View Full Resolution (1024x768) ↗</a></p>
        `;
      }
      convo.messages.push({ role: "assistant", content: `![${text}](${imgUrl})` });
      saveConversations();
      return;
    }

    // Standard Chat Mode
    appendUserMessage(text);
    convo.messages.push({ role: "user", content: text });
    saveConversations();

    const assistantMsgId = appendAssistantMessage("");
    isGenerating = true;
    sendBtn.disabled = true;

    try {
      await streamAIResponse(assistantMsgId, convo.messages, activeModel);
    } catch (err) {
      const targetDiv = document.getElementById(assistantMsgId);
      if (targetDiv) {
        targetDiv.innerHTML = `<span style="color:var(--accent-rose);">Error connecting to AI inference: ${escapeHtml(err.message)}. Try switching models or check your settings.</span>`;
      }
    } finally {
      isGenerating = false;
      sendBtn.disabled = false;
      saveConversations();
    }
  }

  // Inference Dispatcher
  async function streamAIResponse(containerId, messages, modelId) {
    const targetDiv = document.getElementById(containerId);
    let fullText = "";

    // Determine Provider
    const engine = settings.engine;

    // 1. Google Gemini Direct Stream
    if (engine === "gemini" && settings.geminiKey) {
      const gemModel = modelId.startsWith("gemini") ? modelId : "gemini-2.5-flash";
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${gemModel}:streamGenerateContent?alt=sse&key=${settings.geminiKey}`;
      
      const contents = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Gemini HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6).trim();
            try {
              const chunk = JSON.parse(raw);
              const part = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
              fullText += part;
              renderMarkdown(targetDiv, fullText);
            } catch (e) {}
          }
        }
      }
    }
    // 2. Groq Direct Stream
    else if (engine === "groq" && settings.groqKey) {
      const groqModel = modelId.includes("llama") || modelId.includes("gemma") ? modelId : "llama-3.3-70b-versatile";
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.groqKey}`
        },
        body: JSON.stringify({
          model: groqModel,
          messages: [{ role: "system", content: settings.systemPrompt }, ...messages],
          stream: true
        })
      });

      if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
      await handleOpenAICompatibleStream(res, targetDiv, (t) => { fullText += t; });
    }
    // 3. OpenAI Official Direct Stream
    else if (engine === "openai" && settings.openaiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.openaiKey}`
        },
        body: JSON.stringify({
          model: modelId.startsWith("gpt") ? modelId : "gpt-4o-mini",
          messages: [{ role: "system", content: settings.systemPrompt }, ...messages],
          stream: true
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `OpenAI HTTP ${res.status}`);
      }
      await handleOpenAICompatibleStream(res, targetDiv, (t) => { fullText += t; });
    }
    // 4. Default: 100% Free Zero-Key Pollinations AI Stream
    else {
      // Pollinations accepts OpenAI compatible format
      const pollModel = modelId === "flux" ? "openai" : modelId;
      const res = await fetch("https://text.pollinations.ai/openai/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: pollModel,
          messages: [{ role: "system", content: settings.systemPrompt }, ...messages],
          stream: true
        })
      });

      if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
      await handleOpenAICompatibleStream(res, targetDiv, (t) => { fullText += t; });
    }

    // Save final response to conversation
    const convo = getConversation(currentConversationId);
    convo.messages.push({ role: "assistant", content: fullText });
    saveConversations();
  }

  // Universal OpenAI SSE Stream Reader
  async function handleOpenAICompatibleStream(response, targetDiv, onDelta) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let accumulated = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const chunk = JSON.parse(raw);
            const delta = chunk.choices?.[0]?.delta?.content || "";
            if (delta) {
              accumulated += delta;
              onDelta(delta);
              renderMarkdown(targetDiv, accumulated);
            }
          } catch (e) {}
        }
      }
    }
  }

  // Render Markdown with Code Highlighting
  function renderMarkdown(container, markdownText) {
    container.innerHTML = marked.parse(markdownText);

    // Attach copy buttons to pre code blocks
    container.querySelectorAll("pre").forEach(pre => {
      if (pre.querySelector(".copy-btn")) return;
      const code = pre.querySelector("code");
      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.innerHTML = `📋 Copy Code`;
      copyBtn.style.position = "absolute";
      copyBtn.style.top = "6px";
      copyBtn.style.right = "8px";

      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(code ? code.innerText : pre.innerText);
        copyBtn.innerHTML = `✓ Copied!`;
        setTimeout(() => { copyBtn.innerHTML = `📋 Copy Code`; }, 2000);
      });
      pre.appendChild(copyBtn);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Message DOM Append Helpers
  function appendUserMessage(text) {
    const div = document.createElement("div");
    div.className = "message-wrapper user-message";
    div.innerHTML = `
      <div class="message-content">${escapeHtml(text)}</div>
      <div class="message-avatar user-avatar">👤</div>
    `;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendAssistantMessage(initialText) {
    const id = "msg_" + Math.random().toString(36).substr(2, 9);
    const div = document.createElement("div");
    div.className = "message-wrapper assistant-message";
    div.innerHTML = `
      <div class="message-avatar assistant-avatar">⚡</div>
      <div class="message-content" id="${id}">${initialText ? marked.parse(initialText) : '<span style="color:var(--text-muted);">Thinking...</span>'}</div>
    `;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
  }

  // Conversation Management
  function getConversation(id) {
    return conversations.find(c => c.id === id);
  }

  function startNewConversation() {
    const id = "convo_" + Date.now();
    const newConvo = {
      id: id,
      title: "New Conversation",
      timestamp: Date.now(),
      messages: []
    };
    conversations.unshift(newConvo);
    currentConversationId = id;
    saveConversations();
    renderHistoryList();
    renderConversationMessages(newConvo);
  }

  function loadConversation(id) {
    currentConversationId = id;
    localStorage.setItem("ai_gateway_active_convo_id", id);
    const convo = getConversation(id);
    if (convo) {
      renderConversationMessages(convo);
      renderHistoryList();
    }
  }

  function renderConversationMessages(convo) {
    messagesContainer.innerHTML = "";
    if (convo.messages.length === 0) {
      messagesContainer.innerHTML = `
        <div class="message-wrapper assistant-message">
          <div class="message-avatar assistant-avatar">⚡</div>
          <div class="message-content">
            <p><strong>Namaskaram! Welcome to AI Gateway Web Client.</strong></p>
            <p>Ready to assist. Ask any question, generate code in 90+ languages, or create images via FLUX.</p>
          </div>
        </div>
      `;
      return;
    }

    convo.messages.forEach(m => {
      if (m.role === "user") {
        appendUserMessage(m.content);
      } else {
        const id = appendAssistantMessage("");
        const elem = document.getElementById(id);
        if (elem) renderMarkdown(elem, m.content);
      }
    });
  }

  function renderHistoryList() {
    chatHistoryList.innerHTML = "";
    conversations.forEach(c => {
      const item = document.createElement("div");
      item.className = `history-item ${c.id === currentConversationId ? "active" : ""}`;
      
      const titleSpan = document.createElement("span");
      titleSpan.innerText = c.messages[0]?.content ? c.messages[0].content.slice(0, 24) + "..." : c.title;
      titleSpan.style.flex = "1";
      titleSpan.style.overflow = "hidden";
      titleSpan.style.textOverflow = "ellipsis";

      const delBtn = document.createElement("button");
      delBtn.innerHTML = "×";
      delBtn.style.background = "transparent";
      delBtn.style.border = "none";
      delBtn.style.color = "var(--text-muted)";
      delBtn.style.cursor = "pointer";
      delBtn.style.fontSize = "1rem";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteConversation(c.id);
      });

      item.appendChild(titleSpan);
      item.appendChild(delBtn);
      item.addEventListener("click", () => loadConversation(c.id));
      chatHistoryList.appendChild(item);
    });
  }

  function deleteConversation(id) {
    conversations = conversations.filter(c => c.id !== id);
    if (conversations.length === 0) {
      startNewConversation();
    } else if (currentConversationId === id) {
      loadConversation(conversations[0].id);
    } else {
      saveConversations();
      renderHistoryList();
    }
  }

  function saveConversations() {
    localStorage.setItem("ai_gateway_conversations", JSON.stringify(conversations));
    localStorage.setItem("ai_gateway_active_convo_id", currentConversationId);
  }

  newChatBtn.addEventListener("click", startNewConversation);

  // Clear Chat
  clearChatBtn.addEventListener("click", () => {
    if (confirm("Clear messages in current conversation?")) {
      const convo = getConversation(currentConversationId);
      if (convo) {
        convo.messages = [];
        saveConversations();
        renderConversationMessages(convo);
      }
    }
  });

  // Export Chat
  exportChatBtn.addEventListener("click", () => {
    const convo = getConversation(currentConversationId);
    if (!convo || convo.messages.length === 0) {
      alert("No messages to export.");
      return;
    }
    let md = `# Conversation Export (${new Date(convo.timestamp).toLocaleString()})\n\n`;
    convo.messages.forEach(m => {
      md += `### ${m.role === "user" ? "User" : "Assistant"}:\n${m.content}\n\n`;
    });
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-chat-${convo.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Speech to Text (Web Speech API)
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      chatInput.value += (chatInput.value ? " " : "") + transcript;
      micBtn.style.color = "var(--text-secondary)";
    };

    recognition.onerror = () => {
      micBtn.style.color = "var(--text-secondary)";
    };

    micBtn.addEventListener("click", () => {
      micBtn.style.color = "var(--accent-cyan)";
      recognition.start();
    });
  } else {
    micBtn.style.display = "none";
  }

  // Sidebar Mobile Toggle
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Settings Logic
  function loadSettings() {
    settingEngine.value = settings.engine;
    geminiApiKey.value = settings.geminiKey;
    groqApiKey.value = settings.groqKey;
    openaiApiKey.value = settings.openaiKey;
    customBaseUrl.value = settings.customUrl;
    systemPromptInput.value = settings.systemPrompt;
  }

  function updateBadge() {
    const model = modelSelect.value;
    if (settings.engine === "gemini" && settings.geminiKey) {
      badgeText.innerText = "Google Gemini Direct";
      providerBadge.style.color = "var(--accent-cyan)";
    } else if (settings.engine === "groq" && settings.groqKey) {
      badgeText.innerText = "Groq LPU Fast";
      providerBadge.style.color = "var(--accent-amber)";
    } else if (settings.engine === "openai" && settings.openaiKey) {
      badgeText.innerText = "OpenAI Official";
      providerBadge.style.color = "var(--accent-violet)";
    } else {
      badgeText.innerText = model === "flux" ? "Flux AI Image" : "Zero-Key Free Online";
      providerBadge.style.color = "var(--accent-green)";
    }
  }

  modelSelect.addEventListener("change", updateBadge);

  settingsBtn.addEventListener("click", () => {
    loadSettings();
    settingsModal.classList.add("active");
  });

  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("active");
  });

  saveSettingsBtn.addEventListener("click", () => {
    settings = {
      engine: settingEngine.value,
      geminiKey: geminiApiKey.value.trim(),
      groqKey: groqApiKey.value.trim(),
      openaiKey: openaiApiKey.value.trim(),
      customUrl: customBaseUrl.value.trim(),
      systemPrompt: systemPromptInput.value.trim() || "You are an intelligent, helpful AI assistant."
    };
    localStorage.setItem("ai_gateway_settings", JSON.stringify(settings));
    settingsModal.classList.remove("active");
    updateBadge();
    alert("Settings saved successfully!");
  });

  resetDefaultsBtn.addEventListener("click", () => {
    if (confirm("Reset to 100% Free Zero-Key Defaults?")) {
      settings = {
        engine: "pollinations",
        geminiKey: "",
        groqKey: "",
        openaiKey: "",
        customUrl: "",
        systemPrompt: "You are an intelligent, helpful AI assistant."
      };
      localStorage.setItem("ai_gateway_settings", JSON.stringify(settings));
      loadSettings();
      settingsModal.classList.remove("active");
      updateBadge();
    }
  });

  function escapeHtml(string) {
    const entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(string).replace(/[&<>"']/g, s => entityMap[s]);
  }
});
