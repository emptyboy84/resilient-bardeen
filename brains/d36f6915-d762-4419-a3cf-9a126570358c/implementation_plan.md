# Implementation Plan - Convert AetherOS to a Native Desktop App (Electron)

The user requested not to use a web browser ("웹쓰지말고") to run AetherOS. We will package the application using Electron so it runs as a native desktop window.

## Proposed Changes

We will introduce Electron to run the application in a standalone desktop window:
1. **Express Server integration**: Electron will start the existing Express server (`server.js`) on startup.
2. **Native Window**: Electron will open a borderless/styled window and load `http://localhost:3000`.
3. **Graceful Shutdown**: When the Electron window is closed, the background Express server will shut down automatically.

---

### Project Configuration

#### [MODIFY] [package.json](file:///c:/Users/lg/fix/package.json)
- Add `electron` dependency.
- Change the `main` script to `main.js` (Electron entrypoint).
- Add `start` script to run `electron .`.

#### [NEW] [main.js](file:///c:/Users/lg/fix/main.js)
Create the Electron main process script:
- Start the Express server.
- Create a `BrowserWindow` with native options.
- Load `http://localhost:3000`.
- Handle window closure and clean up the server.

---

## Verification Plan

### Automated/Manual Verification
1. Run `npm install` to install `electron`.
2. Run `npm start` to launch AetherOS as a desktop app.
3. Test touchpad/workspace swipe gestures inside the native Electron desktop window to verify they are smooth and responsive.
