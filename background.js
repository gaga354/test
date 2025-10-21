// Background Service Worker for Chrome Extension

// 확장 프로그램 설치 시
chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome Extension이 설치되었습니다!');
});

// 확장 프로그램 아이콘 클릭 시
chrome.action.onClicked.addListener((tab) => {
  console.log('확장 프로그램 아이콘이 클릭되었습니다!');
});

// 메시지 수신 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('메시지 수신:', request);
  sendResponse({ status: 'success' });
  return true;
});
