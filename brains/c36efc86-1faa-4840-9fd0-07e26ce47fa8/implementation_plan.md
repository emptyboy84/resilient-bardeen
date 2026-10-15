# 비즈노(bizno.net) 접속 문제 해결을 위한 프록시 쿠키 유지 계획

비즈노 사이트는 트래픽 폭증 시 대기열 시스템(10초 대기 페이지)을 보여주며, 세션 쿠키를 통해 대기 상태를 검증합니다. 기존 프록시 서버는 보안을 위해 모든 요청에서 `Cookie` 헤더를 제거하고 있었기 때문에, 대기열 페이지가 무한 새로고침되는 현상이 발생했습니다. 비즈노 관련 도메인 접속 시 쿠키를 전송하도록 수정하여 이를 해결하고자 합니다.

## User Review Required

> [!IMPORTANT]
> - 프록시 서버(`server.js`)에서 `bizno.net`으로 향하는 요청에 대해 클라이언트의 `Cookie` 헤더를 삭제하지 않고 대상 서버로 그대로 전달하도록 변경합니다.
> - 이 변경 사항은 비즈노 접속 시 무한 대기열 루프를 방지하고 정상적인 세션 처리를 가능하게 합니다.

## Proposed Changes

### 백엔드 프록시 서버

#### [MODIFY] [server.js](file:///c:/Users/lg/fix/server.js)

- `bizno.net` 도메인을 판별하는 로직 추가
- 비즈노 도메인일 경우 `headers.cookie` 제거 로직 우회

```diff
     // Set up headers to forward, cleaning out host and overriding referer/origin
     const headers = { ...req.headers };
     delete headers.host;
-    delete headers.cookie;
+    
+    // 비즈노(bizno.net)의 경우 세션 및 대기열 검증을 위해 쿠키 보존 필요
+    const isBizno = targetUrlStr && targetUrlStr.includes('bizno.net');
+    if (!isBizno) {
+      delete headers.cookie;
+    }
+    
     delete headers['accept-encoding'];
```

## Verification Plan

### Manual Verification
1. 프록시 서버를 구동합니다 (`npm run dev` 또는 `node server.js`).
2. AetherOS 데스크톱 브라우저 앱에 접속하여 주소창에 `https://bizno.net`을 입력합니다.
3. 10초 대기열 화면이 나타난 후, 카운트다운이 끝나고 정상적으로 비즈노 메인 화면으로 진입하는지 확인합니다.
