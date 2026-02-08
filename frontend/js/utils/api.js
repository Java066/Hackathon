(function () {
  function getApiBaseUrl() {
    return window.API_BASE_URL ||
      (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) ||
      'http://127.0.0.1:8000';
  }

  async function postChat(payload) {
    const base = getApiBaseUrl();
    let response;

    try {
      response = await fetch(`${base}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (networkError) {
      throw new Error(`Network error calling ${base}/chat: ${networkError.message}`);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  }

  window.ApiClient = {
    postChat,
    getApiBaseUrl,
  };
})();
