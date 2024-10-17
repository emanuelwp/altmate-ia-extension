chrome.webNavigation.onCompleted.addListener((details) => {
  console.log('Extensão instalada!');
  chrome.scripting.executeScript({
    target: {tabId: details.tabId},
    files: ['content.js']
  });
}, {url: [{urlMatches : 'https://*/*'}, {urlMatches: 'http://*/*'}]});
