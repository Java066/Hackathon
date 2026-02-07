(function () {
  async function postChat(payload) {
    const base = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 'http://127.0.0.1:8000';
    const response = await fetch(`${base}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  window.ApiClient = {
    postChat,
  };
})();
