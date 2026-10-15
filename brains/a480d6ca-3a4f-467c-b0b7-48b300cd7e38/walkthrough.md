# Walkthrough: Virtual Desktop & Touchpad Fixes

This walkthrough details the changes made to fix the touchpad (trackpad) gesture bugs and Naver Map sandbox environment issues.

## Changes Made

### 1. Touchpad & Workspace Switching Fixes (`public/app.js`)
- **Native Viewport Scroll Snap**: Added a `scroll` event listener on `#workspaces-viewport` that locks `scrollLeft` to `0`. This fixes a common trackpad bug in WebKit/Blink where horizontal swipes natively scroll `overflow: hidden` containers, misaligning the workspaces.
- **Global History Swipe Prevention**: Moved the `wheel` event listener from the desktop container to the global `window` level, explicitly registering it with `{ passive: false }`. This allows `e.preventDefault()` to run successfully, stopping the host browser from performing page-level "back/forward" navigation when swipe gestures occur on the desktop background.
- **Accidental Switch Filtering**: Requiring the horizontal component (`deltaX`) to be at least double the vertical component (`deltaY * 2`) and raised the threshold (`SWIPE_THRESHOLD` from 30 to 40) to prevent vertical trackpad scrolls with minor horizontal drifts from triggering workspace transitions.
- **Window Isolation**: Completely isolated windows, taskbars, and menus from trackpad swipes, allowing you to scroll normally inside apps while only switching workspaces when swiping on the desktop background.

### 2. Sandbox, History, & Timing Fixes (`server.js`)
- **Location & Window Redefinitions**: Overrode `Window.prototype` properties `parent` and `top` to bypass Naver Map's frame-busting hostname tests that redirected to inaccessible dev API endpoints.
- **Enhanced Location Mocking**: Overrode `protocol` to `'https:'`, `port` to `''`, and `ancestorOrigins` on `Location.prototype` to fully emulate Naver Map running on its native secure domain (`https://map.naver.com`).
- **Reciprocal Push/ReplaceState Mapping**: Intercepted history manipulation calls and translated both absolute and relative target URLs into local proxy paths, eliminating the browser's `SecurityError` caused by origin mismatch.
- **Infinite Loop Correction**: Wrapped `Location.prototype.assign` and `replace` with captured native methods to prevent recursive stack overflows.

## Verification

### 1. Verification of Code Integrity
All JavaScript files (`server.js` and `public/app.js`) are clean, without syntax errors, and run on Node.js.

### 2. Manual Verification Instructions
1. Run the server using:
   ```bash
   node server.js
   ```
2. Open `http://localhost:3000` in Chrome, Edge, or Safari.
3. Open the **Naver Map** app. Verify it loads securely on the production endpoint.
4. Try clicking or navigating within the map. The address bar should dynamically update to match the map's state without throwing `SecurityError`s.
5. Go to the desktop background and perform a horizontal trackpad swipe. Verify that:
   - The workspace switches smoothly.
   - The page does not navigate back/forward (reload/exit).
   - The workspaces do not drift or misalign.
   - Scrolling inside active apps does not trigger workspace changes.
