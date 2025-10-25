# Image to Video Converter

이미지를 영상으로 변환하는 웹 애플리케이션입니다. 서버 없이 브라우저에서 직접 동작합니다.

## 🚀 [웹사이트 바로가기](https://gaga354.github.io/test/)

## ✨ 주요 기능

### 📹 영상 출력
- **WebM 형식**: 모든 브라우저 지원, 빠른 생성, HTTP 서버 불필요
- **MP4 형식**: 최고 호환성, FFmpeg.wasm 변환 (HTTP 서버 필요)
- **해상도 프리셋**: Full HD, 4K, 인스타그램, 유튜브, TikTok 등
- **품질 조절**: 저화질(2 Mbps) ~ 최고화질(20 Mbps)
- **FPS 설정**: 24~60 프레임

### 🎨 이미지 편집
- **여러 이미지 업로드**: 드래그 앤 드롭 또는 파일 선택
- **9방향 정렬 그리드**: 클릭 한 번으로 이미지 위치 조정
- **크기 및 위치**: 너비/높이 비율, X/Y 좌표 세밀 조정
- **맞춤 방식**: Cover, Contain, Fill
- **시각 효과**: 배경색, 테두리, 그림자
- **필터 효과**: 밝기, 대비, 채도, 흐림, 세피아, 회전 등

### 🎬 애니메이션 & 트랜지션
- **Ken Burns 효과**: 줌인/아웃, 패닝 애니메이션
- **트랜지션**: 페이드, 슬라이드 (좌/우/상/하)
- **커스텀 지속시간**: 0~3초 자유 설정
- **랜덤 배정**: 자동 애니메이션 적용

### 📝 전역 텍스트 오버레이
- **폰트 선택**: Arial, Times New Roman, 맑은 고딕, 나눔고딕 등 10종
- **위치 조정**: 상단/중앙/하단 + Y 오프셋
- **텍스트 효과**:
  - 그림자 (색상, 블러, X/Y 오프셋)
  - 테두리/스트로크 (색상, 두께)
  - 배경 박스 (색상, 투명도)

### 🃏 스토리보드
- **드래그 앤 드롭**: 이미지 순서 변경
- **카드 크기 조절**: 50%~150% 슬라이더
- **실시간 미리보기**: 애니메이션 재생, 줌, 그리드 표시
- **개별 설정**: 각 이미지 클릭하여 상세 편집

### 💾 프리셋 시스템
- 설정 저장 및 불러오기
- localStorage 자동 저장

## 🔧 기술 스택

- **프론트엔드**: Vanilla JavaScript, HTML5, CSS3
- **영상 처리**: MediaRecorder API (WebM 녹화)
- **MP4 변환**: FFmpeg.wasm 0.12.6
- **캔버스 렌더링**: HTML5 Canvas API
- **스토리지**: localStorage (프리셋 저장)
- **100% 클라이언트 사이드** (서버 불필요, MP4 변환 시 HTTP 서버만 필요)

## 🐛 문제 해결

### MP4 변환 실패: "origin 'null'" 에러

**증상**: MP4 다운로드 시 에러 발생, 콘솔에 "Worker" 또는 "origin" 관련 메시지

**원인**: HTML 파일을 직접 열어서 `file://` 프로토콜로 실행 중

**해결**: 위의 [방법 2~4](#방법-2-python-간단-서버-권장---mp4-변환-가능)를 사용하여 HTTP 서버 실행

### 영상 생성이 느립니다

**해결 방법**:
- 해상도 낮추기: 4K → Full HD
- 품질 낮추기: 최고화질 → 중간
- FPS 낮추기: 60 → 30
- 이미지 개수 줄이기

### MP4 변환이 오래 걸립니다

**정상입니다!** FFmpeg.wasm은 브라우저에서 실행되므로 네이티브 FFmpeg보다 느립니다.

- **첫 실행**: FFmpeg 로딩(20~30초) + 변환(10~20초) = 30초~1분
- **이후 실행**: 변환만(10~20초)

`-c copy` 옵션으로 빠른 컨테이너 변환을 사용합니다 (재인코딩 없음).

## 📦 Chrome Extension

이 저장소에는 기본 Chrome Extension 구조도 포함되어 있습니다.

## 🛠️ 로컬 실행 (개인 사용)

### ⚠️ 중요: MP4 변환 기능 사용 시 주의사항

**MP4 형식으로 다운로드하려면 HTTP 서버가 필요합니다!**

FFmpeg.wasm은 브라우저 보안 정책상 `file://` 프로토콜(HTML 파일 직접 열기)에서는 작동하지 않습니다.

- ✅ **WebM 형식**: 파일 직접 열기로 사용 가능
- ❌ **MP4 형식**: HTTP 서버 필요 (아래 방법 2~4 참고)

### 방법 1: 파일 직접 열기 (WebM만 가능)
```bash
# 저장소 클론
git clone https://github.com/gaga354/test.git
cd test

# 브라우저로 index.html 직접 열기
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```
또는 파일 탐색기에서 `index.html`을 더블클릭하세요.

**제한**: MP4 변환 불가, WebM 형식만 다운로드 가능

### 방법 2: Python 간단 서버 (권장 - MP4 변환 가능)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
브라우저에서 `http://localhost:8000` 접속

### 방법 3: Node.js 서버
```bash
# http-server 설치 (최초 1회)
npm install -g http-server

# 서버 실행
http-server -p 8000
```
브라우저에서 `http://localhost:8000` 접속

### 방법 4: VS Code Live Server
1. VS Code에서 프로젝트 폴더 열기
2. Live Server 확장 프로그램 설치
3. `index.html` 우클릭 > "Open with Live Server"

## 📱 모바일에서 접속하기

### 옵션 1: 같은 WiFi에서 로컬 서버 접속 (개인 사용)

**1단계: PC에서 서버 실행**
```bash
# 모든 네트워크 인터페이스에서 접속 허용
python3 -m http.server 8000 --bind 0.0.0.0
```

**2단계: PC의 IP 주소 확인**
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
# 또는
ip addr show
```
WiFi IP 주소를 찾으세요 (예: `192.168.0.10`)

**3단계: 모바일에서 접속**
- 모바일이 **같은 WiFi**에 연결되어 있는지 확인
- 모바일 브라우저에서 `http://PC의IP:8000` 접속
- 예: `http://192.168.0.10:8000`

### 옵션 2: GitHub Pages 사용 (권장)

저장소를 Public으로 설정하고 GitHub Pages를 활성화하면:
- ✅ 무료로 사용 가능
- ✅ 모바일/PC 어디서나 접속
- ✅ URL: `https://gaga354.github.io/test/`
- ✅ URL을 아는 사람만 접속 가능 (실질적으로 개인 사용)

**설정 방법:**
1. GitHub 저장소 Settings > Pages
2. Source: main branch 선택
3. Save 클릭
4. 몇 분 후 배포 완료

## 📝 라이선스

MIT License
