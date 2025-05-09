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

    // Fetch current span counts
    chrome.runtime.sendMessage({type: 'GET_CURRENT_SPAN_COUNTS'}, (response) => {
      if (response) {
        updateSpanCounts(response.spans, response.events);
      }
    });
});
function updateSpanCounts(spans, events) {
  document.getElementById('span-count-display').textContent = `Spans: ${spans}`;
  document.getElementById('span-event-count-display').textContent = `Span Events: ${events}`;
  const engagements = Math.ceil((spans + events) / 100);
  document.getElementById('engagements-display').textContent = `Engagements: ${engagements}`;
}
document.getElementById('start-new-session').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'START_NEW_SESSION' });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_SPAN_COUNT') {
    updateSpanCounts(message.spans, message.events);

  }
});