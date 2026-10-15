using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class WinStaTest {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr OpenWindowStation(string lpszWinSta, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetProcessWindowStation(IntPtr hWinSta);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr OpenDesktop(string lpszDesktop, uint dwFlags, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetThreadDesktop(IntPtr hDesktop);

    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumDesktopWindows(IntPtr hDesktop, EnumWindowsProc lpfn, IntPtr lParam);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    public static extern int GetWindowTextLength(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    public static void Run() {
        IntPtr hwinsta = OpenWindowStation("WinSta0", false, 0x037F);
        Console.WriteLine("OpenWindowStation: " + hwinsta);
        if (hwinsta != IntPtr.Zero) {
            bool setWs = SetProcessWindowStation(hwinsta);
            Console.WriteLine("SetProcessWindowStation: " + setWs);
        }

        IntPtr hdesk = OpenDesktop("default", 0, false, 0x01FF);
        Console.WriteLine("OpenDesktop: " + hdesk);
        if (hdesk != IntPtr.Zero) {
            bool setDesk = SetThreadDesktop(hdesk);
            Console.WriteLine("SetThreadDesktop: " + setDesk);

            EnumDesktopWindows(hdesk, (hWnd, lParam) => {
                int len = GetWindowTextLength(hWnd);
                if (len > 0) {
                    StringBuilder sb = new StringBuilder(len + 1);
                    GetWindowText(hWnd, sb, sb.Capacity);
                    uint pid;
                    GetWindowThreadProcessId(hWnd, out pid);
                    bool vis = IsWindowVisible(hWnd);
                    Console.WriteLine(string.Format("PID: {0} | Vis: {1} | Title: {2}", pid, vis, sb.ToString()));
                }
                return true;
            }, IntPtr.Zero);
        }
    }
}
