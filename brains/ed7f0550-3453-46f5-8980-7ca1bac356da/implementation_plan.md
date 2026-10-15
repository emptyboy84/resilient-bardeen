# 프록시 서버 인젝션 스크립트 수정 및 압축 헤더 대응 계획

데스크톱 웹 브라우저 앱에서 bizno.net(비즈노) 등의 일반 사이트가 정상적으로 작동하지 않는 문제를 해결하기 위한 조치 계획입니다.

## 문제 원인 분석
1. **무조건적인 네이버 도메인 에뮬레이션**: `server.js`에서 모든 `text/html` 응답에 네이버 지도용 `window.location.hostname = 'map.naver.com'` 및 `document.domain = 'naver.com'` 모킹 코드를 강제로 주입하고 있습니다. 이로 인해 bizno.net과 같은 일반 도메인 사이트에 접속했을 때 해당 사이트의 스크립트가 비정상 동작합니다.
2. **응답 데이터 깨짐 가능성**: 프록시 서버 요청 시 브라우저가 전달한 `accept-encoding` 헤더를 그대로 대상 서버에 전달하지만, axios의 `responseType`은 `arraybuffer`로 설정되어 압축 해제 없이 수신되어 텍스트 변환 시 깨질 수 있습니다.

## 제안하는 변경 사항

### 프록시 서버 (`server.js`)
- `accept-encoding` 헤더를 삭제하여 대상 서버가 압축되지 않은 본문 데이터를 반환하도록 처리합니다.
- HTML 응답 가로채기(injection) 시 타겟 도메인이 `naver.com`일 경우에만 네이버 관련 도메인/윈도우 모킹이 적용되도록 제한합니다.
- `toProxiedUrl` 등 범용적인 프록시 변환 함수가 하드코딩된 `map.naver.com` 대신 동적 타겟 URL을 기준으로 처리하도록 수정합니다.

#### [MODIFY] [server.js](file:///c:/Users/lg/fix/server.js)

```diff
@@ -61,4 +61,5 @@
     const headers = { ...req.headers };
     delete headers.host;
     delete headers.cookie;
+    delete headers['accept-encoding'];
     
     const targetOrigin = parsedUrl.origin;
@@ -109,7 +110,8 @@
       let html = response.data.toString('utf8');
 
       // Use final redirected URL to compute the correct base path
       const finalUrl = response.config.url || targetUrlStr;
       const finalParsedUrl = new URL(finalUrl);
+      const isNaver = finalParsedUrl.hostname.includes('naver.com');
 
       // Inject base tag and scripts
       const injection = `
@@ -118,29 +120,33 @@
   // Advanced Sandbox & Domain Emulation (map.naver.com emulation)
   (function() {
     const realParent = window.parent;
     const realTop = window.top;
     const realOrigin = window.location.origin; // Critical: Save real origin before mocking
+    const targetOrigin = "${finalParsedUrl.origin}";
+    const targetHostname = "${finalParsedUrl.hostname}";
+    const isNaver = ${isNaver};
     
-    // 1. Shadow window properties (Bypass Clickjacking Frame-Busting checks)
-    try {
-      // Try on Window.prototype first, which is more reliable in modern browsers
-      Object.defineProperty(Window.prototype, 'parent', {
-        get: function() { return window; },
-        configurable: true
-      });
-      Object.defineProperty(Window.prototype, 'top', {
-        get: function() { return window; },
-        configurable: true
-      });
-    } catch(e) {}
-    try {
-      // Fallback/direct on window instance
-      Object.defineProperty(window, 'top', {
-        get: function() { return window; },
-        configurable: true
-      });
-      Object.defineProperty(window, 'parent', {
-        get: function() { return window; },
-        configurable: true
-      });
-    } catch(e) {}
 
     // Helper to rewrite external URLs to proxy-compatible local URLs
     function toProxiedUrl(inputUrl) {
       if (!inputUrl) return inputUrl;
       try {
-        let currentVirtualUrl = 'https://map.naver.com/';
+        let currentVirtualUrl = targetOrigin + '/';
         try {
           const realUrl = new URL(window.location.toString());
           const target = realUrl.searchParams.get('url');
           if (target) {
             currentVirtualUrl = target;
           } else {
-            currentVirtualUrl = 'https://map.naver.com' + realUrl.pathname + realUrl.search;
+            currentVirtualUrl = targetOrigin + realUrl.pathname + realUrl.search;
           }
         } catch(e) {}
 
         const absoluteTarget = new URL(inputUrl, currentVirtualUrl);
         if (absoluteTarget.origin === realOrigin) {
           return inputUrl;
         }
 
         const localUrl = new URL(absoluteTarget.pathname + absoluteTarget.search + absoluteTarget.hash, realOrigin);
         localUrl.searchParams.set('url', absoluteTarget.href);
         return localUrl.pathname + localUrl.search + localUrl.hash;
       } catch(e) {
         console.error('toProxiedUrl error:', e);
         return inputUrl;
       }
     }
 
-    // 2. Mocks Location prototype (Bypass Environment / Hostname test-server detection)
-    try {
-      const orgHostnameDesc = Object.getOwnPropertyDescriptor(Location.prototype, 'hostname');
-      const orgHostDesc = Object.getOwnPropertyDescriptor(Location.prototype, 'host');
-      const orgOriginDesc = Object.getOwnPropertyDescriptor(Location.prototype, 'origin');
-      
-      const originalAssign = Location.prototype.assign;
-      const originalReplace = Location.prototype.replace;
-
-      Object.defineProperty(Location.prototype, 'hostname', {
-        get: function() { return 'map.naver.com'; },
-        set: function(val) { if (orgHostnameDesc && orgHostnameDesc.set) orgHostnameDesc.set.call(this, val); },
-        configurable: true
-      });
-      
-      Object.defineProperty(Location.prototype, 'host', {
-        get: function() { return 'map.naver.com'; },
-        set: function(val) { if (orgHostDesc && orgHostDesc.set) orgHostDesc.set.call(this, val); },
-        configurable: true
-      });
-
-      Object.defineProperty(Location.prototype, 'origin', {
-        get: function() { return 'https://map.naver.com'; },
-        configurable: true
-      });
-
-      Object.defineProperty(Location.prototype, 'protocol', {
-        get: function() { return 'https:'; },
-        configurable: true
-      });
-
-      Object.defineProperty(Location.prototype, 'port', {
-        get: function() { return ''; },
-        configurable: true
-      });
-
-      Location.prototype.toString = function() {
-        return this.href;
-      };
-
-      Object.defineProperty(Location.prototype, 'href', {
-        get: function() {
-          const currentUrl = window.location.toString();
-          try {
-            const url = new URL(currentUrl);
-            const target = url.searchParams.get('url');
-            if (target) return target;
-          } catch(e) {}
-          return 'https://map.naver.com' + window.location.pathname + window.location.search;
-        },
-        set: function(val) {
-          window.location = toProxiedUrl(val);
-        },
-        configurable: true
-      });
-
-      Object.defineProperty(Location.prototype, 'ancestorOrigins', {
-        get: function() {
-          return {
-            0: 'https://map.naver.com',
-            length: 1,
-            item: function(i) { return i === 0 ? 'https://map.naver.com' : null; },
-            contains: function(val) { return val === 'https://map.naver.com'; }
-          };
-        },
-        configurable: true
-      });
-
-      // Override location navigation functions using our helper and captured native methods
-      Location.prototype.assign = function(url) {
-        try {
-          originalAssign.call(this, toProxiedUrl(url));
-        } catch(e) {
-          window.location = toProxiedUrl(url);
-        }
-      };
-      
-      Location.prototype.replace = function(url) {
-        try {
-          originalReplace.call(this, toProxiedUrl(url));
-        } catch(e) {
-          originalReplace.call(this, url);
-        }
-      };
-    } catch(e) {
-      console.error('Location mock failed:', e);
-    }
-
-    // 3. Mock document.domain to naver.com & document.referrer
-    try {
-      Object.defineProperty(Document.prototype, 'domain', {
-        get: function() { return 'naver.com'; },
-        configurable: true
-      });
-      Object.defineProperty(Document.prototype, 'referrer', {
-        get: function() { return 'https://map.naver.com/'; },
-        configurable: true
-      });
-    } catch(e) {}
+    if (isNaver) {
+      // 1. Shadow window properties (Bypass Clickjacking Frame-Busting checks)
+      try {
+        Object.defineProperty(Window.prototype, 'parent', {
+          get: function() { return window; },
+          configurable: true
+        });
+        Object.defineProperty(Window.prototype, 'top', {
+          get: function() { return window; },
+          configurable: true
+        });
+      } catch(e) {}
+      try {
+        Object.defineProperty(window, 'top', {
+          get: function() { return window; },
+          configurable: true
+        });
+        Object.defineProperty(window, 'parent', {
+          get: function() { return window; },
+          configurable: true
+        });
+      } catch(e) {}
+
+      // 2. Mocks Location prototype (Bypass Environment / Hostname test-server detection)
+      try {
+        const orgHostnameDesc = Object.getOwnPropertyDescriptor(Location.prototype, 'hostname');
+        const orgHostDesc = Object.getOwnPropertyDescriptor(Location.prototype, 'host');
+        const orgOriginDesc = Object.getOwnPropertyDescriptor(Location.prototype, 'origin');
+        
+        const originalAssign = Location.prototype.assign;
+        const originalReplace = Location.prototype.replace;
+
+        Object.defineProperty(Location.prototype, 'hostname', {
+          get: function() { return 'map.naver.com'; },
+          set: function(val) { if (orgHostnameDesc && orgHostnameDesc.set) orgHostnameDesc.set.call(this, val); },
+          configurable: true
+        });
+        
+        Object.defineProperty(Location.prototype, 'host', {
+          get: function() { return 'map.naver.com'; },
+          set: function(val) { if (orgHostDesc && orgHostDesc.set) orgHostDesc.set.call(this, val); },
+          configurable: true
+        });
+
+        Object.defineProperty(Location.prototype, 'origin', {
+          get: function() { return 'https://map.naver.com'; },
+          configurable: true
+        });
+
+        Object.defineProperty(Location.prototype, 'protocol', {
+          get: function() { return 'https:'; },
+          configurable: true
+        });
+
+        Object.defineProperty(Location.prototype, 'port', {
+          get: function() { return ''; },
+          configurable: true
+        });
+
+        Location.prototype.toString = function() {
+          return this.href;
+        };
+
+        Object.defineProperty(Location.prototype, 'href', {
+          get: function() {
+            const currentUrl = window.location.toString();
+            try {
+              const url = new URL(currentUrl);
+              const target = url.searchParams.get('url');
+              if (target) return target;
+            } catch(e) {}
+            return 'https://map.naver.com' + window.location.pathname + window.location.search;
+          },
+          set: function(val) {
+            window.location = toProxiedUrl(val);
+          },
+          configurable: true
+        });
+
+        Object.defineProperty(Location.prototype, 'ancestorOrigins', {
+          get: function() {
+            return {
+              0: 'https://map.naver.com',
+              length: 1,
+              item: function(i) { return i === 0 ? 'https://map.naver.com' : null; },
+              contains: function(val) { return val === 'https://map.naver.com'; }
+            };
+          },
+          configurable: true
+        });
+
+        Location.prototype.assign = function(url) {
+          try {
+            originalAssign.call(this, toProxiedUrl(url));
+          } catch(e) {
+            window.location = toProxiedUrl(url);
+          }
+        };
+        
+        Location.prototype.replace = function(url) {
+          try {
+            originalReplace.call(this, toProxiedUrl(url));
+          } catch(e) {
+            originalReplace.call(this, url);
+          }
+        };
+      } catch(e) {
+        console.error('Location mock failed:', e);
+      }
+
+      // 3. Mock document.domain to naver.com & document.referrer
+      try {
+        Object.defineProperty(Document.prototype, 'domain', {
+          get: function() { return 'naver.com'; },
+          configurable: true
+        });
+        Object.defineProperty(Document.prototype, 'referrer', {
+          get: function() { return 'https://map.naver.com/'; },
+          configurable: true
+        });
+      } catch(e) {}
+    }
```

## 검증 계획
1. 로컬 프록시 서버를 재시작하여 정상 동작 여부를 확인합니다.
2. 브라우저 앱을 켜고 `https://bizno.net`에 직접 접속하여 에뮬레이션 스크립트로 인한 사이트 오작동 여부와 응답 로딩에 문제가 없는지 테스트합니다.
3. 네이버 지도(`https://map.naver.com`) 기능 역시 이전처럼 온전히 잘 동작하는지(모킹이 활성화되는지) 함께 테스트합니다.
