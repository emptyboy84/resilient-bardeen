using System;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class EdgeWindowTracker {
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
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
    [DllImport("user32.dll")]
    public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdcBmp, uint nFlags);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left, Top, Right, Bottom;
    }

    public static void Run() {
        IntPtr hwinsta = OpenWindowStation("WinSta0", false, 0x037F);
        if (hwinsta != IntPtr.Zero) SetProcessWindowStation(hwinsta);
        IntPtr hdesk = OpenDesktop("default", 0, false, 0x01FF);
        if (hdesk != IntPtr.Zero) {
            SetThreadDesktop(hdesk);
            int idx = 0;
            EnumDesktopWindows(hdesk, (hWnd, lParam) => {
                int len = GetWindowTextLength(hWnd);
                if (len > 0) {
                    StringBuilder sb = new StringBuilder(len + 1);
                    GetWindowText(hWnd, sb, sb.Capacity);
                    uint pid;
                    GetWindowThreadProcessId(hWnd, out pid);
                    bool vis = IsWindowVisible(hWnd);
                    RECT r;
                    GetWindowRect(hWnd, out r);
                    int w = r.Right - r.Left;
                    int h = r.Bottom - r.Top;
                    if (vis && w > 100 && h > 100) {
                        Console.WriteLine(string.Format("HWND: 0x{0:X} | PID: {1} | Rect: ({2},{3},{4}x{5}) | Title: {6}", hWnd.ToInt64(), pid, r.Left, r.Top, w, h, sb.ToString()));
                        // Save screenshot of each visible major window
                        if (sb.ToString().Contains("Edge") || sb.ToString().Contains("드림") || sb.ToString().Contains("온라인")) {
                            string path = string.Format("C:\\Users\\lg\\.gemini\\antigravity\\brain\\44470555-939d-4160-8744-09bb2f099064\\scratch\\win_{0}.png", idx);
                            using (Bitmap bmp = new Bitmap(w, h)) {
                                using (Graphics g = Graphics.FromImage(bmp)) {
                                    IntPtr hdc = g.GetHdc();
                                    PrintWindow(hWnd, hdc, 2);
                                    g.ReleaseHdc(hdc);
                                }
                                bmp.Save(path, ImageFormat.Png);
                                Console.WriteLine("  -> Saved screenshot: " + path);
                            }
                            idx++;
                        }
                    }
                }
                return true;
            }, IntPtr.Zero);
        }
    }
}
