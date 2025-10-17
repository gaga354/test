chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_INFO') {
    sendResponse({
      title: document.title,
      url: window.location.href,
    });
  }
});
