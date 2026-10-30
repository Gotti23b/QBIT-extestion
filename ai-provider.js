(() => {
  const host = location.hostname;
  const provider = host.includes("arena.ai") ? "Arena.ai" : host.includes("gemini") ? "Gemini" : host.includes("claude") ? "Claude" : host.includes("deepseek") ? "DeepSeek" : host.includes("qwen") ? "Qwen" : host.includes("meta.ai") ? "Meta AI" : "ChatGPT";
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const editors = {
    "ChatGPT": '#prompt-textarea, [contenteditable="true"].ProseMirror',
    "Arena.ai": "form textarea",
    "Gemini": 'rich-textarea [contenteditable="true"], [contenteditable="true"].ql-editor',
    "Claude": '[contenteditable="true"].ProseMirror, [contenteditable="true"]',
    "DeepSeek": "textarea",
    "Qwen": "textarea.message-input-textarea",
    "Meta AI": "textarea"
  };
  const replies = {
    "ChatGPT": '[data-message-author-role="assistant"] .markdown, [data-message-author-role="assistant"]',
    "Arena.ai": "ol.flex-col-reverse > div .prose",
    "Gemini": "model-response message-content, model-response .model-response-text",
    "Claude": '[data-testid="chat-message-content"], .font-claude-message',
    "DeepSeek": '[data-message="assistant"], .ds-markdown',
    "Qwen": ".message-content-container .markdown-body, .qwen-chat-message-assistant .markdown-body",
    "Meta AI": '[data-testid*="assistant"], [data-message-author-role="assistant"]'
  };
  const sendButtons = {
    "ChatGPT": '#composer-submit-button, button[data-testid="send-button"]',
    "Arena.ai": 'button[aria-label*="Send message"], button[aria-label*="Enviar"]',
    "Gemini": 'button[aria-label*="Send"], button[aria-label*="Enviar"]',
    "Claude": 'button[aria-label*="Send Message"], button[aria-label*="Send"]',
    "DeepSeek": 'button[aria-label*="Send"], button[aria-label*="发送"]',
    "Qwen": ".chat-prompt-send-button, button[aria-label*="Send"]",
    "Meta AI": 'button[aria-label*="Send"], button[aria-label*="Enviar"]'
  };

  function getReplies() {
    const nodes = [...document.querySelectorAll(replies[provider])];
    if (provider === "Arena.ai") return nodes.filter(node => !node.closest(".justify-end")).reverse();
    return nodes;
  }
  function replyText() {
    const nodes = getReplies();
    return (nodes.at(-1)?.innerText || nodes.at(-1)?.textContent || "").trim();
  }
  function setEditor(editor, text) {
    editor.focus();
    if (editor instanceof HTMLTextAreaElement || editor instanceof HTMLInputElement) {
      const proto = editor instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(editor, text);
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editor);
      selection.removeAllRanges();
      selection.addRange(range);
      const lines = String(text).split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i]) document.execCommand("insertText", false, lines[i]);
        if (i < lines.length - 1) document.execCommand("insertLineBreak");
      }
    }
  }
  function isGenerating() {
    return !!document.querySelector('button[data-testid="stop-button"], button[aria-label*="Stop generation"], button[aria-label*="Stop generating"], button[aria-label*="Detener"]');
  }
  async function ask(message) {
    const editor = document.querySelector(editors[provider]);
    if (!editor) throw new Error(`No encuentro el cuadro de mensaje de ${provider}. Recargá esa pestaña.`);
    const idleStarted = Date.now();
    while (isGenerating() && Date.now() - idleStarted < 120000) await sleep(500);
    if (isGenerating()) throw new Error(`${provider} todavía está respondiendo otro mensaje.`);
    const previous = replyText();
    const previousCount = getReplies().length;
    setEditor(editor, message);
    await sleep(250);
    const readyStarted = Date.now();
    let send = document.querySelector(sendButtons[provider]);
    while (send && (send.disabled || send.getAttribute("aria-disabled") === "true") && Date.now() - readyStarted < 5000) {
      await sleep(100);
      send = document.querySelector(sendButtons[provider]);
    }
    if (send && !send.disabled && send.getAttribute("aria-disabled") !== "true") send.click();
    else editor.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));

    const startedAt = Date.now();
    let answer = "";
    let changedAt = 0;
    while (Date.now() - startedAt < 120000) {
      await sleep(350);
      const nodes = getReplies();
      const current = (nodes.at(-1)?.innerText || nodes.at(-1)?.textContent || "").trim();
      if (current && (current !== previous || nodes.length > previousCount)) {
        if (current !== answer) { answer = current; changedAt = Date.now(); }
        if (!isGenerating() && Date.now() - changedAt >= 1400) return { ok: true, answer, provider };
      }
    }
    throw new Error(answer ? `${provider} no terminó de responder en dos minutos.` : `${provider} no generó una respuesta.`);
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "QBIT_AI_PROMPT") return;
    ask(String(message.message || "").slice(0, 12000))
      .then(sendResponse, error => sendResponse({ ok: false, error: error?.message || String(error), provider }));
    return true;
  });
})();
