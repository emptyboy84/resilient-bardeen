# Uninstall / Remove Hermes Program

The user requested to delete the "Hermes" program ("hermess프로그램 지워").

Since Hermes is installed as a portable/extracted Electron application without an official uninstaller registered in Windows Settings, we will manually delete the directories, configuration cache, shortcuts, and installer files associated with it to perform a clean and complete removal.

## User Review Required

> [!CAUTION]
> This action will permanently and irreversibly delete the following files and directories associated with Hermes. Please review the target paths carefully.

## Proposed Changes

We will delete the following items from the system:

### 1. Main Application & Agent Files
*   **[DELETE] Directory:** `C:\Users\lg\AppData\Local\hermes`
    *   *Description:* Contains the application code, the Python virtual environment (`venv`), local database (`state.db`), configuration files (`config.yaml`, `.env`), and the executable `Hermes.exe`.

### 2. Cache & User Profile Data
*   **[DELETE] Directory:** `C:\Users\lg\AppData\Roaming\Hermes`
    *   *Description:* Contains user profiles, LocalStorage, preferences, and Edge WebView2/Electron cache data.
*   **[DELETE] Directory:** `C:\Users\lg\AppData\Local\com.nousresearch.hermes.setup`
    *   *Description:* Contains WebView2 runtime caches created when running the setup/agent.

### 3. Shortcuts & Installer
*   **[DELETE] File:** `C:\Users\lg\Desktop\Hermes.lnk`
    *   *Description:* The desktop shortcut pointing to the Hermes executable.
*   **[DELETE] File:** `C:\Users\lg\Downloads\Hermes-Setup.exe`
    *   *Description:* The installer executable downloaded to the Downloads folder.

---

## Verification Plan

### Manual Verification
1.  Verify that all of the above paths no longer exist on the filesystem.
2.  Confirm that the Hermes icon is removed from the Desktop.
