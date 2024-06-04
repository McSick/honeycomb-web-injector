document.getElementById('options-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const pattern = document.getElementById('pattern').value;
    const apiKey = document.getElementById('apiKey').value;
    const serviceName = document.getElementById('serviceName').value;
    const enabled = document.getElementById('enabled').checked;
    chrome.storage.sync.set({ pattern, apiKey, serviceName, enabled }, () => {
      alert('Options saved!');
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['pattern', 'apiKey', 'serviceName', 'enabled'], (items) => {
      if (items.pattern) {
        document.getElementById('pattern').value = items.pattern;
      }
      if (items.apiKey) {
        document.getElementById('apiKey').value = items.apiKey;
      }
      if (items.serviceName) {
        document.getElementById('serviceName').value = items.serviceName;
      }
      if (items.enabled !== undefined) {
        document.getElementById('enabled').checked = items.enabled;
      }
    });
  });
  