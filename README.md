# Image to Video Converter

이미지를 영상으로 변환하는 웹 애플리케이션입니다. 서버 없이 브라우저에서 직접 동작합니다.

## 🚀 [웹사이트 바로가기](https://gaga354.github.io/test/)

## ✨ 주요 기능

- **여러 이미지 업로드**: 한 번에 여러 이미지 선택 가능
- **세부 설정 조정**:
  - 재생 시간 (초 단위)
  - 크기 (너비/높이, % 단위)
  - 위치 (X/Y, % 단위)
  - 맞춤 방식 (Cover/Contain/Fill)
- **캔버스 설정**: 해상도 및 FPS 조정
- **실시간 미리보기**: 첫 번째 이미지 설정 확인
- **영상 생성**: WebM 포맷으로 다운로드

## 🔧 기술 스택

- HTML5 Canvas API
- MediaRecorder API
- FileReader API
- 100% 클라이언트 사이드 (서버 불필요)

## 📦 Chrome Extension

이 저장소에는 기본 Chrome Extension 구조도 포함되어 있습니다.

## 🛠️ 로컬 실행

```bash
# 저장소 클론
git clone https://github.com/gaga354/test.git
cd test

# 브라우저로 index.html 열기
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

## 📝 라이선스

MIT License
