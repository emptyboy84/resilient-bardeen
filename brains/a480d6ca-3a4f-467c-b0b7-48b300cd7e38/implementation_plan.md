# Virtual Desktop Web App with Multi-Screen & Iframe URL Tracking

This plan outlines the creation of a premium, glassmorphism-styled Virtual Desktop web application. It addresses the user's requirements of:
1. **Virtual Desktop (Multiple Screens)**: Creating a system of multiple workspaces/desktops that users can switch between with smooth animations, complete with draggable, resizable, and overlapping windows.
2. **Iframe URL Tracking & Loading (Naver Map, etc.)**: Solving the issue where external sites (like Naver Map) block iframe embedding (due to `X-Frame-Options` / `CSP`) or don't update the address bar when navigating (due to cross-origin security). We will solve this by implementing a lightweight Node.js Express server that acts as a reverse proxy, stripping headers and enabling same-origin URL tracking.

## User Review Required

> [!IMPORTANT]
> - **Local Server Execution**: To run the proxy server that strips iframe-blocking headers and tracks URLs, the app must be started via Node.js (`npm run dev` or `npm start` which will run `server.js`). Running via a double-clicked raw HTML file (`file://`) will not support proxying or URL tracking due to browser security limitations.
> - **Naver Map and Iframe Compatibility**: By proxying Naver Map and injecting a `<base>` tag, we resolve layout and asset loading. Some advanced interactive SPAs may still perform cross-origin API requests that trigger CORS. We will add a fallback "Open in New Tab" button in the address bar in case a page has highly strict script-level security.

## Proposed Changes

We will create a Node.js project inside `C:\Users\lg\fix`.

### [Component: Backend Server & Proxy]

#### [NEW] [package.json](file:///C:/Users/lg/fix/package.json)
Initializes the Node.js project with dependencies (`express`, `axios`, `cors`).

#### [NEW] [server.js](file:///C:/Users/lg/fix/server.js)
An Express server that:
- Serves static files from the `public` directory.
- Exposes a `/proxy` endpoint that fetches external pages (like Naver Map), strips security headers (`X-Frame-Options`, `Content-Security-Policy`), injects a `<base>` tag so relative links resolve correctly to the target site, and returns the modified HTML.
- Implements CORS headers so that proxied scripts can load assets.

### [Component: Frontend Client]

#### [NEW] [public/index.html](file:///C:/Users/lg/fix/public/index.html)
The desktop container structure, including:
- Desktop area supporting multiple virtual workspaces (screens).
- Bottom taskbar with a start menu, active window shortcuts, desktop switcher, and system clock.
- Overlay elements for window templates.

#### [NEW] [public/style.css](file:///C:/Users/lg/fix/public/style.css)
A premium design system using Vanilla CSS featuring:
- Vibrant gradient background with neon accents.
- Modern typography (Outfit / Inter).
- Glassmorphism effects (`backdrop-filter: blur(20px)`, subtle borders, glow shadows).
- Smooth transitions for workspace switching, window maximizing, and workspace scaling.
- Responsive taskbar and window designs.

#### [NEW] [public/app.js](file:///C:/Users/lg/fix/public/app.js)
The core client-side JavaScript logic:
- **Workspace Manager**: Manages multiple screens. Switches desktops via keyboard shortcuts (e.g., Ctrl + Arrow Keys) or taskbar controls with sliding transitions.
- **Window Manager**: Handles window creation, dragging, resizing, focus sorting (Z-index), minimization, maximization, and closing.
- **Virtual Browser (URL Tracker)**:
  - Tracks navigation in the iframe by accessing `iframe.contentWindow.location` (made possible because the proxy keeps the iframe on the same origin).
  - Listens to `load` and periodic intervals to sync the virtual address bar with the iframe's current address.
  - Resolves proxy URLs back to human-readable target URLs.
- **Notes App & System Settings**: Lightweight built-in apps to showcase a fully functional desktop environment.

## Verification Plan

### Automated Verification
- We will start the Node.js server using `node server.js` and verify it runs on port `3000`.
- We will check if the client loads and is fully responsive.

### Manual Verification
1. Open the virtual desktop in a browser at `http://localhost:3000`.
2. Open the "Internet Browser" app.
3. Type `https://map.naver.com` in the address bar and press Enter. Verify Naver Map loads inside the window.
4. Interact with Naver Map (e.g., search a location, click a place) and check if the virtual address bar updates to the new location URL.
5. Create a second screen (virtual desktop), open the "Notes" app there, and switch back and forth between screens to verify workspace isolation.
