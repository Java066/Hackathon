document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('input');
  const sendBtn = document.getElementById('send');

  function appendMessage(text, cls) {
    const d = document.createElement('div');
    d.className = 'message ' + cls;
    d.textContent = text;
    messagesEl.appendChild(d);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function send() {
    const text = inputEl.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    inputEl.value = '';
    appendMessage('Thinking...', 'bot');
    try {
      const reply = await window.aiService.sendMessageToAI(text);
      const bots = messagesEl.querySelectorAll('.bot');
      const lastBot = bots[bots.length - 1];
      if (lastBot) lastBot.textContent = reply;
      else appendMessage(reply, 'bot');
    } catch (e) {
      const bots = messagesEl.querySelectorAll('.bot');
      const lastBot = bots[bots.length - 1];
      if (lastBot) lastBot.textContent = 'Error: ' + e.message;
    }
  }

  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
});
