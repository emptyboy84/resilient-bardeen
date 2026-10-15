Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class WindowFinder {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr OpenInputDesktop(uint dwFlags, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetThreadDesktop(IntPtr hDesktop);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool CloseDesktop(IntPtr hDesktop);

    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    public static extern int GetWindowTextLength(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    public static List<string> FindWindows() {
        IntPtr hDesk = OpenInputDesktop(0, false, 0x01FF);
        if (hDesk != IntPtr.Zero) {
            SetThreadDesktop(hDesk);
        }

        List<string> results = new List<string>();
        EnumWindows((hWnd, lParam) => {
            int len = GetWindowTextLength(hWnd);
            StringBuilder sb = new StringBuilder(len + 10);
            GetWindowText(hWnd, sb, sb.Capacity);
            string title = sb.ToString();
            uint pid;
            GetWindowThreadProcessId(hWnd, out pid);
            bool vis = IsWindowVisible(hWnd);
            if (!string.IsNullOrEmpty(title)) {
                results.Add(string.Format("HWND: 0x{0:X} | PID: {1} | Visible: {2} | Title: {3}", hWnd.ToInt64(), pid, vis, title));
            }
            return true;
        }, IntPtr.Zero);

        if (hDesk != IntPtr.Zero) {
            CloseDesktop(hDesk);
        }
        return results;
    }
}
"@

Write-Host "Finding windows with OpenInputDesktop..."
$wins = [WindowFinder]::FindWindows()
Write-Host "Found $($wins.Count) windows:"
$wins | ForEach-Object { Write-Host $_ }
