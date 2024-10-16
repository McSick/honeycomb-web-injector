chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  if (request.type === 'START_TRACING') {
    const script = document.createElement('script');
    const scriptSrc = chrome.runtime.getURL('dist/tracing.bundle.js');
    script.src = scriptSrc;

    script.onerror = () => console.error('Failed to load script:', scriptSrc);
    script.onload = () => {
      console.log('Tracing bundle loaded:', scriptSrc);
      window.postMessage({
        type: 'START_TRACING',
        apiKey: request.apiKey,
        serviceName: request.serviceName,
        initialCounts: request.initialCounts
      }, '*');
      console.log('Tracing start message posted');
    };

    document.documentElement.appendChild(script);
    console.log('Tracing bundle script appended:', scriptSrc);
  } else if (request.type === 'START_NEW_SESSION') {
    window.postMessage({ 
      type: 'START_NEW_SESSION',
      initialCounts: request.initialCounts
    }, '*');
  }
});

window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data.type === 'UPDATE_SPAN_COUNT') {
    chrome.runtime.sendMessage(event.data);
  }
});