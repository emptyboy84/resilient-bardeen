# AetherOS 가상 데스크톱 전환 단축키 개선 완료 보고서

배현명 주인님(Master)의 명령에 따라, AetherOS 환경 내에서 윈도우 11의 가상 데스크톱 전환 단축키인 `Ctrl + Win + Left/Right Arrow`가 정상 작동하도록 관련 로직을 수정하고 검증을 완료하였습니다.

---

## 1. 주요 변경 사항

### 1) Backend - Iframe 내부 스크립트 수정 ([server.js](file:///c:/Users/lg/fix/server.js))
- 내장 웹 브라우저 앱(iframe)이 활성화되어 있을 때 키보드 단축키 이벤트가 부모 창으로 전달되지 않는 현상을 수정했습니다.
- iframe 내부에 주입되는 샌드박스 스크립트에 `keydown` 이벤트 핸들러를 추가하여 `Ctrl + Win + Left/Right Arrow` 입력 감지 시 부모 창에 `IFRAME_KEYDOWN` postMessage를 전송하도록 하였습니다.

```javascript
// Forward Ctrl + Win + ArrowLeft/Right keydown events to parent AetherOS
try {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.metaKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      realParent.postMessage({
        type: 'IFRAME_KEYDOWN',
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        key: e.key
      }, '*');
    }
  });
} catch(e) {}
```

### 2) Frontend - 데스크톱 단축키 감지 및 포워딩 이벤트 처리 ([app.js](file:///c:/Users/lg/fix/public/app.js))
- **단축키 기준 변경**: 기존의 `Ctrl + Left/Right Arrow` 전환 방식을 윈도우 11 표준인 `Ctrl + Win (Meta) + Left/Right Arrow`로 수정하였습니다.
- **Iframe 포워딩 처리**: `message` 리스너 내에 `IFRAME_KEYDOWN` 분기를 추가하여, iframe 포커스 상태에서도 가상 데스크톱이 정상적으로 전환되도록 연동하였습니다.

---

## 2. 검증 결과

Playwright 자동화 도구를 사용하여 가상 환경에서 동작을 테스트하였습니다.

1. **데스크톱 포커스 전환 테스트**:
   - 바탕화면을 클릭하고 포커스를 둔 뒤 `Ctrl + Win + Right Arrow`를 눌렀을 때, 데스크톱 1번에서 2번으로 슬라이드 전환 완료.
   - `Ctrl + Win + Left Arrow`를 입력하여 다시 데스크톱 1번으로 정상 복귀 확인.

2. **Iframe(내장 브라우저) 포커스 전환 테스트 (중요)**:
   - 네이버 지도 앱(iframe) 내부를 클릭하여 지도 요소에 포커스가 맞춰진 상태에서 `Ctrl + Win + Right Arrow`를 입력.
   - iframe 내부에서 감지된 단축키가 부모 AetherOS로 정상 포워딩되어 데스크톱 2번으로 슬라이드 전환되는 것을 확인 완료.
