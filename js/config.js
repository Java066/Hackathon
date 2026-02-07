(function () {
  const fromWindow = window.__API_BASE_URL__;
  const fromLocalStorage = window.localStorage ? localStorage.getItem('API_BASE_URL') : null;
  const defaultBase = 'http://127.0.0.1:8000';

  window.APP_CONFIG = {
    API_BASE_URL: fromWindow || fromLocalStorage || defaultBase,
  };
})();
