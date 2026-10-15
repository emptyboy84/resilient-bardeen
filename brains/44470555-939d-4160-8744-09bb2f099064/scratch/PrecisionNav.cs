using System;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

public class PrecisionNav {
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
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int X, int Y);
    [DllImport("user32.dll")]
    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
    [DllImport("user32.dll")]
    public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdcBmp, uint nFlags);

    const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    const uint MOUSEEVENTF_LEFTUP   = 0x0004;
    const uint KEYEVENTF_KEYUP      = 0x0002;

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }

    public static void Attach() {
        IntPtr hwinsta = OpenWindowStation("WinSta0", false, 0x037F);
        if (hwinsta != IntPtr.Zero) SetProcessWindowStation(hwinsta);
        IntPtr hdesk = OpenDesktop("default", 0, false, 0x01FF);
        if (hdesk != IntPtr.Zero) SetThreadDesktop(hdesk);
    }

    public static IntPtr FindWindow() {
        Attach();
        IntPtr found = IntPtr.Zero;
        IntPtr hdesk = OpenDesktop("default", 0, false, 0x01FF);
        if (hdesk != IntPtr.Zero) {
            EnumDesktopWindows(hdesk, (hWnd, lParam) => {
                int len = GetWindowTextLength(hWnd);
                if (len > 0) {
                    StringBuilder sb = new StringBuilder(len + 1);
                    GetWindowText(hWnd, sb, sb.Capacity);
                    string title = sb.ToString();
                    if (title.Contains("드림캠퍼스") && IsWindowVisible(hWnd)) {
                        found = hWnd;
                        return false;
                    }
                }
                return true;
            }, IntPtr.Zero);
        }
        return found;
    }

    public static void Click(int x, int y) {
        Attach();
        SetCursorPos(x, y);
        Thread.Sleep(30);
        mouse_event(MOUSEEVENTF_LEFTDOWN, (uint)x, (uint)y, 0, 0);
        Thread.Sleep(30);
        mouse_event(MOUSEEVENTF_LEFTUP, (uint)x, (uint)y, 0, 0);
    }

    public static void AdvanceNext(string savePath) {
        Attach();
        IntPtr hWnd = FindWindow();
        if (hWnd == IntPtr.Zero) return;

        SetForegroundWindow(hWnd);
        Thread.Sleep(300);

        RECT rect;
        GetWindowRect(hWnd, out rect);
        int w = rect.Right - rect.Left;
        int h = rect.Bottom - rect.Top;

        // Try exact coordinates for the '>' button
        Console.WriteLine("Clicking '>' button at various points in bottom right...");
        Click(rect.Right - 5, rect.Bottom - 14);
        Thread.Sleep(100);
        Click(rect.Right - 8, rect.Bottom - 14);
        Thread.Sleep(100);
        Click(rect.Right - 12, rect.Bottom - 14);
        Thread.Sleep(100);

        // Also try F12 -> Console to inject full automation
        Console.WriteLine("Sending F12...");
        keybd_event(0x7B, 0, 0, 0); // VK_F12 = 0x7B
        Thread.Sleep(50);
        keybd_event(0x7B, 0, KEYEVENTF_KEYUP, 0);

        Thread.Sleep(2000);

        using (Bitmap bmp = new Bitmap(w, h)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                IntPtr hdc = g.GetHdc();
                PrintWindow(hWnd, hdc, 2);
                g.ReleaseHdc(hdc);
            }
            bmp.Save(savePath, ImageFormat.Png);
            Console.WriteLine("Captured: " + savePath);
        }
    }
}
