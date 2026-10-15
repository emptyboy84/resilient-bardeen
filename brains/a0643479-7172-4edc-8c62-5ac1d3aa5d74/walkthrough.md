# Hermes Agent Launch Crash Resolution Walkthrough

## Issue Summary
When launching the Hermes Agent desktop application on this Windows environment, the Electron renderer process crashed immediately in a hot loop with exit code `-2147483645` (`STATUS_BREAKPOINT`). This is a known issue where Chromium's sandbox initialization fails on specific OS/security configurations.

---

## Changes Implemented

### 1. Main Process Code Patch & Repackaging
* **File Modified**: [main.cjs](file:///C:/Users/lg/AppData/Local/hermes/hermes-agent/apps/desktop/electron/main.cjs#L131-L138)
* **Change**: Added the `--no-sandbox` switch at the process level to permanently bypass Chromium's sandbox check.
```diff
 app.commandLine.appendSwitch('disable-renderer-backgrounding')
 app.commandLine.appendSwitch('disable-backgrounding-occluded-windows')
 app.commandLine.appendSwitch('disable-background-timer-throttling')
+// Disable the Chromium sandbox to prevent STATUS_BREAKPOINT crashes on some Windows machines/virtual environments
+app.commandLine.appendSwitch('no-sandbox')
```
* **Packaging**: Re-ran `npm.cmd run pack` in `apps/desktop` to re-bundle the application inside `release\win-unpacked` containing the patched ASAR.

### 2. Shortcut Arguments Update
* **Paths Updated**:
  * `C:\Users\lg\Desktop\Hermes.lnk`
  * `C:\Users\lg\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Hermes.lnk`
* **Change**: Added `--no-sandbox` to the target arguments of both shortcuts.

---

## Verification & Testing
* **Test Case 1 (Shortcut Launch/Direct Launch with Sandbox Disabled)**: Verified that launching `Hermes.exe` with `--no-sandbox` bypassed the renderer crash loop and successfully initiated the backend bootstrap sequence.
* **Test Case 2 (Post-Build Run)**: Launched the newly compiled `Hermes.exe` without any command line arguments. Verified that it successfully started the backend and resolved ports, confirming the hardcoded `no-sandbox` switch works as expected.
