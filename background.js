chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.sync.get(['pattern', 'apiKey', 'serviceName'], ({ pattern, apiKey, serviceName }) => {
        console.log('Retrieved settings from storage:', { pattern, apiKey, serviceName });
        const regex = new RegExp(pattern);
        if (regex.test(tab.url)) {
          console.log('URL matches pattern:', tab.url);
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          }, () => {
            console.log('Content script injected');
            chrome.tabs.sendMessage(tabId, { apiKey: apiKey, serviceName: serviceName });
          });
        } else {
          console.log('URL does not match pattern:', tab.url);
        }
      });
    }
  });
  