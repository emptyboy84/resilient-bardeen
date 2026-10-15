# 1. Edge Session & History files
$edgeData = "$env:LOCALAPPDATA\Microsoft\Edge\User Data"
Write-Host "Edge User Data Path: $edgeData"

if (Test-Path $edgeData) {
    # Find all profile folders
    $profiles = Get-ChildItem $edgeData -Directory | Where-Object { $_.Name -match "Default|Profile" }
    foreach ($p in $profiles) {
        Write-Host "`n--- Profile: $($p.Name) ---"
        $sessionsDir = Join-Path $p.FullName "Sessions"
        if (Test-Path $sessionsDir) {
            Get-ChildItem $sessionsDir | Sort-Object LastWriteTime -Descending | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
        }
        
        # Check History file timestamp
        $historyFile = Join-Path $p.FullName "History"
        if (Test-Path $historyFile) {
            $hItem = Get-Item $historyFile
            Write-Host "History file last modified: $($hItem.LastWriteTime)"
        }
    }
}

# 2. Win32 EnumWindows
Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class WinEnum {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumDesktopWindows(IntPtr hDesktop, EnumWindowsProc lpfn, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    public static extern int GetWindowTextLength(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    public static List<string> GetAllWindows() {
        List<string> list = new List<string>();
        EnumWindows((hWnd, lParam) => {
            int length = GetWindowTextLength(hWnd);
            if (length > 0) {
                StringBuilder sb = new StringBuilder(length + 1);
                GetWindowText(hWnd, sb, sb.Capacity);
                uint pid;
                GetWindowThreadProcessId(hWnd, out pid);
                bool visible = IsWindowVisible(hWnd);
                list.Add(string.Format("PID: {0} | Visible: {1} | Title: {2}", pid, visible, sb.ToString()));
            }
            return true;
        }, IntPtr.Zero);
        return list;
    }
}
"@

Write-Host "`n=== Win32 EnumWindows Output ==="
$windows = [WinEnum]::GetAllWindows()
foreach ($w in $windows) {
    Write-Host $w
}
