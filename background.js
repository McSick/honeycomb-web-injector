let globalCounts = { spanCount: 0, spanEventCount: 0 };

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get(['pattern', 'apiKey', 'serviceName', 'enabled'], ({ pattern, apiKey, serviceName, enabled }) => {
      console.log('Retrieved settings from storage:', { pattern, apiKey, serviceName, enabled });
      if (!enabled) {
        console.log('Injection is disabled');
        return;
      }
      const regex = new RegExp(pattern);
      if (regex.test(tab.url)) {
        console.log('URL matches pattern:', tab.url);
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }, () => {
          console.log('Content script injected');
          chrome.tabs.sendMessage(tabId, { 
            type: 'START_TRACING', 
            apiKey: apiKey, 
            serviceName: serviceName,
            initialCounts: globalCounts
          });
        });
      } else {
        console.log('URL does not match pattern:', tab.url);
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_NEW_SESSION') {
    globalCounts = { spanCount: 0, spanEventCount: 0 };
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'START_NEW_SESSION',
          initialCounts: globalCounts
        });
      }
    });
    chrome.storage.local.set(globalCounts);
  } else if (message.type === 'UPDATE_SPAN_COUNT') {
    globalCounts = {
      spanCount: message.spans,
      spanEventCount: message.events
    };
    chrome.storage.local.set(globalCounts);
    chrome.runtime.sendMessage(message);
  }
});

// Load initial counts from storage when the background script starts
chrome.storage.local.get(['spanCount', 'spanEventCount'], (items) => {
  globalCounts = {
    spanCount: items.spanCount || 0,
    spanEventCount: items.spanEventCount || 0
  };
});