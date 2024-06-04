chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in content script:', request);
    const script = document.createElement('script');
    const scriptSrc = chrome.runtime.getURL('dist/tracing.bundle.js');
    script.src = scriptSrc;
  
    script.onerror = () => console.error('Failed to load script:', scriptSrc);
    script.onload = () => {
      console.log('Tracing bundle loaded:', scriptSrc);
      window.postMessage({
        type: 'START_TRACING',
        apiKey: request.apiKey,
        serviceName: request.serviceName
      }, '*');
      console.log('Tracing start message posted');
    };
  
    document.documentElement.appendChild(script);
    console.log('Tracing bundle script appended:', scriptSrc);
  });
  