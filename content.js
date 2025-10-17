if (!window.__pageInfoListenerRegistered) {
  window.__pageInfoListenerRegistered = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'GET_PAGE_INFO') {
      sendResponse({
        title: document.title,
        url: window.location.href,
      });
    }
  });
}
