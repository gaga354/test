document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('action-button');
  const status = document.getElementById('status');
  const details = document.getElementById('page-details');

  const resetStatus = () => {
    status.textContent = '현재 탭 정보를 가져오려면 버튼을 눌러주세요.';
    details.textContent = '';
  };

  resetStatus();

  button?.addEventListener('click', async () => {
    if (!status || !details) {
      return;
    }

    status.textContent = '탭 정보를 가져오는 중...';
    details.textContent = '';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        status.textContent = '활성 탭을 찾을 수 없습니다.';
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_INFO' });

      if (response?.title) {
        status.textContent = '탭 정보 가져오기 완료!';
        details.textContent = `${response.title}\n${response.url ?? ''}`.trim();
      } else {
        status.textContent = '탭 정보를 불러오지 못했습니다.';
      }
    } catch (error) {
      console.error(error);
      status.textContent = '메시지를 전송할 수 없습니다.';
    }
  });
});
