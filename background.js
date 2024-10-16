let globalCounts = { spanCount: 0, spanEventCount: 0 };
// Assuming you have these icon files in your extension directory
const activeIcons = {
  16: 'icon-active.png',
  32: 'icon-active.png',
  48: 'icon-active.png',
  128: 'icon-active.png'
};

const inactiveIcons = {
  16: 'icon.png',
  32: 'icon.png',
  48: 'icon.png',
  128: 'icon.png'
};

function updateIcon(tabId, isActive) {
  const icons = isActive ? activeIcons : inactiveIcons;
  chrome.action.setIcon({
    tabId: tabId,
    path: icons
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get(['pattern', 'apiKey', 'serviceName', 'enabled'], ({ pattern, apiKey, serviceName, enabled }) => {
      console.log('Retrieved settings from storage:', { pattern, apiKey, serviceName, enabled });
      if (!enabled) {
        updateIcon(tabId, false);
        console.log('Injection is disabled');
        return;
      }
      const regex = new RegExp(pattern);
      if (regex.test(tab.url)) {
        console.log('URL matches pattern:', tab.url);
        updateIcon(tabId, true);
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
        updateIcon(tabId, true);
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
  } else if (message.type === 'GET_CURRENT_SPAN_COUNTS') {
    sendResponse({
      spans: globalCounts.spanCount,
      events: globalCounts.spanEventCount
    });
  }
});

// Load initial counts from storage when the background script starts
chrome.storage.local.get(['spanCount', 'spanEventCount'], (items) => {
  globalCounts = {
    spanCount: items.spanCount || 0,
    spanEventCount: items.spanEventCount || 0
  };
  console.log('Loaded initial counts from storage:', globalCounts);
  chrome.runtime.sendMessage({ type: 'UPDATE_SPAN_COUNT', spans: globalCounts.spanCount, events: globalCounts.spanEventCount });
});

// Listen for changes in storage to update icon if settings change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && (changes.pattern || changes.enabled)) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.storage.sync.get(['pattern', 'enabled'], ({ pattern, enabled }) => {
          const regex = new RegExp(pattern);
          const isActive = enabled && regex.test(tabs[0].url);
          updateIcon(tabs[0].id, isActive);
        });
      }
    });
  }
});