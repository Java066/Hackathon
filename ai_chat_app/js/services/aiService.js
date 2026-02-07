async function sendMessageToAI(message) {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'API error');
  }

  const body = await resp.json();
  return body.reply;
}

window.aiService = { sendMessageToAI };
