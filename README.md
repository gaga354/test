# Chrome Extension Scaffold

이 저장소에는 현재 탭의 제목과 주소를 가져오는 크롬 확장 프로그램의 기본 구조가 포함되어 있습니다.

## 구성 요소
- `manifest.json`: 확장의 메타데이터와 서비스 워커, 팝업, 콘텐츠 스크립트, 호스트 권한을 정의합니다.
- `background.js`: 확장이 설치될 때 간단한 로그를 남깁니다.
- `popup.html`, `popup.js`, `style.css`: 팝업 UI와 동작을 담당합니다. `popup.js`는 필요한 경우 `content.js`를 주입해 탭 정보를 안전하게 가져옵니다.
- `content.js`: 팝업에서 요청했을 때 현재 페이지의 정보를 반환합니다.

## 변경 사항이 원격 저장소에 반영되지 않는 이유
현재 저장소에는 원격(Remote) 설정이 없습니다. `git remote -v` 명령을 실행해도 아무 것도 출력되지 않기 때문에, 변경 사항을 푸시할 대상 저장소가 없습니다. 변경 사항을 외부 저장소에 반영하려면 먼저 `git remote add <name> <url>` 명령으로 원격을 등록한 뒤, `git push <name> <branch>`로 푸시해야 합니다.

