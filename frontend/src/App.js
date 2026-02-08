import React, { useState } from 'react';
import { API_BASE_URL, getHealth, sendChatMessage } from './api/client';

function App() {
  const [health, setHealth] = useState(null);
  const [message, setMessage] = useState('How can I reduce my monthly spending?');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkHealth = async () => {
    setError('');
    try {
      const result = await getHealth();
      setHealth(result.status);
    } catch (err) {
      setHealth('unreachable');
      setError(err.message);
    }
  };

  const onSend = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setReply('');

    try {
      const result = await sendChatMessage(message, 'demo-user');
      setReply(result.reply || 'No reply received.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', margin: '2rem auto', maxWidth: 760 }}>
      <h1>AI Assistant / Chat</h1>
      <p>Backend API: <code>{API_BASE_URL}</code></p>

      <section style={{ marginBottom: '1.5rem' }}>
        <button type="button" onClick={checkHealth}>Check /health</button>
        {health && <p>Health status: <strong>{health}</strong></p>}
      </section>

      <section>
        <form onSubmit={onSend}>
          <label htmlFor="chat-message">Message</label>
          <textarea
            id="chat-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={{ display: 'block', width: '100%', marginTop: '.5rem' }}
          />
          <button type="submit" disabled={loading || !message.trim()} style={{ marginTop: '.75rem' }}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>

        {reply && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
            <strong>Assistant:</strong>
            <p style={{ marginBottom: 0 }}>{reply}</p>
          </div>
        )}

        {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      </section>
    </main>
  );
}

export default App;
