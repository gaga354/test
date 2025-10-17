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

      const fetchPageInfo = async () =>
        chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_INFO' });

      let response;

      try {
        response = await fetchPageInfo();
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('Receiving end does not exist')
        ) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js'],
            });
            response = await fetchPageInfo();
          } catch (injectError) {
            console.error(injectError);
            status.textContent = '콘텐츠 스크립트를 주입할 수 없습니다.';
            return;
          }
        } else {
          throw error;
        }
      }

      if (response?.title) {
        status.textContent = '탭 정보 가져오기 완료!';
        details.textContent = `${response.title}\n${response.url ?? ''}`.trim();
      } else {
        status.textContent = '탭 정보를 불러오지 못했습니다.';
      }
    } catch (error) {
      console.error(error);
      status.textContent = '탭 정보를 불러오는 중 문제가 발생했습니다.';
    }
  });
});
