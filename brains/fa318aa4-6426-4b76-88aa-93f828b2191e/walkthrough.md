# 가상 데스크톱 단축키 충돌 오류 수정 워크스루

Windows OS의 기본 가상 데스크톱 전환 단축키(`Ctrl + Win + Left/Right`)가 AetherOS 내부에서 가로채져서(preventDefault), Windows 데스크톱 전환이 막히고 엣지 창 내부의 AetherOS 화면만 전환되어 창이 같이 따라가는 것처럼 보였던 현상을 해결하였습니다.

## 변경된 내용

AetherOS 내부의 가상 데스크톱 화면 전환 단축키를 Windows OS 단축키와 충돌하지 않는 **`Alt + Shift + 방향키(ArrowLeft/ArrowRight)`**로 변경하였습니다.

### [MODIFY] [server.js](file:///c:/Users/lg/fix/server.js)
- Iframe 내에서 `Ctrl + Win + Arrow` 조합을 포워딩하는 keydown 이벤트를 `Alt + Shift + Arrow` 조합을 포워딩하도록 수정하였습니다.

### [MODIFY] [app.js](file:///c:/Users/lg/fix/public/app.js)
- Iframe으로부터 전달되는 `IFRAME_KEYDOWN` 이벤트를 감지할 때 `Alt + Shift + Arrow` 조건인지 확인하도록 수정하였습니다.
- 부모 창의 Global `keydown` 이벤트 핸들러에서 가로채는 단축키를 `Alt + Shift + Arrow`로 변경하였습니다.

## 테스트 결과 및 검증
- 이제 `Ctrl + Win + 방향키`는 AetherOS에 의해 차단되지 않으므로, 실제 Windows OS의 가상 데스크톱 전환 기능이 온전하게 작동합니다.
- AetherOS 내부 화면 전환이 필요할 때는 `Alt + Shift + 방향키`를 통해 전환하실 수 있습니다.
