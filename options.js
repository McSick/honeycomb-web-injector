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

document.getElementById('start-new-session').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'START_NEW_SESSION' });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_SPAN_COUNT') {
    document.getElementById('span-count-display').textContent = `Spans: ${message.spans}`;
    document.getElementById('span-event-count-display').textContent = `Span Events: ${message.events}`;
    const engagements = Math.ceil((message.spans + message.events) / 100);
    document.getElementById('engagements-display').textContent = `Engagements: ${engagements}`;
  }
});