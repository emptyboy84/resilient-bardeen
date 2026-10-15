# AetherOS 가상 데스크톱 전환 단축키 변경 및 개선 계획

주인님(배현명 님)의 명령에 따라, AetherOS 환경 내에서 윈도우 11의 멀티윈도우(가상 데스크톱) 전환 단축키(`Ctrl + Win + Left/Right Arrow`)가 제대로 동작하도록 수정하고 개선하기 위한 계획입니다.

## 수정 대상 및 제안

현재 AetherOS는 `Ctrl + Left/Right Arrow` 조합으로 데스크톱을 전환하도록 하드코딩되어 있습니다. 또한 웹 브라우저 앱(iframe)이 포커싱되어 있을 때는 키 이벤트가 부모 창으로 전달되지 않아 단축키가 작동하지 않는 문제가 있습니다. 

다음과 같이 수정하여 문제를 해결하겠습니다:

1. **단축키 조합 변경**: 기존 `Ctrl + Left/Right Arrow`를 윈도우 11 표준인 `Ctrl + Win (Meta) + Left/Right Arrow`로 변경합니다.
2. **Iframe 내부 키 이벤트 포워딩**: 웹 브라우저(iframe)가 포커싱된 상태에서도 단축키가 작동하도록, iframe 내부에 주입되는 스크립트에서 `keydown` 이벤트를 가로채어 부모 창으로 메시지를 전송(postMessage)합니다.
3. **부모 창 수신 및 처리**: 부모 창(`app.js`)의 `message` 이벤트 핸들러에서 iframe으로부터 전달된 `Ctrl + Win + Left/Right Arrow` 입력을 받아 데스크톱 전환을 수행합니다.

---

## 제안된 변경 사항

### 1. Backend Server Component (Iframe 스크립트 주입)

#### [MODIFY] [server.js](file:///c:/Users/lg/fix/server.js)
- iframe 내부에 삽입되는 Javascript 스크립트에 `keydown` 이벤트 핸들러를 추가합니다.
- `Ctrl + Win + Left/Right Arrow` 키 입력 감지 시 `postMessage`를 통해 부모 창에 `IFRAME_KEYDOWN` 메시지를 전달하도록 구현합니다.

### 2. Frontend Core Desktop Component

#### [MODIFY] [app.js](file:///c:/Users/lg/fix/public/app.js)
- **전역 키 리스너 수정**: `setupEventListeners` 함수 내부의 `keydown` 이벤트 리스너에서 조건식을 `e.ctrlKey && e.metaKey` 로 변경합니다.
- **메시지 리스너 수정**: `window.addEventListener('message')` 내부에 `IFRAME_KEYDOWN` 타입을 처리하는 분기를 추가하여, iframe 포커스 상태에서도 가상 데스크톱이 정상 전환되도록 합니다.

---

## 검증 계획

### 수동 검증
1. AetherOS 통합 서버 실행 후 브라우저 접속
2. 데스크톱 빈 공간 클릭 후 `Ctrl + Win + Left/Right Arrow` 입력 시 데스크톱(워크스페이스) 슬라이드 전환 확인
3. 내장 브라우저 앱(iframe)을 클릭하여 포커스를 준 상태에서 `Ctrl + Win + Left/Right Arrow` 입력 시 정상적으로 데스크톱이 슬라이드 전환되는지 확인
