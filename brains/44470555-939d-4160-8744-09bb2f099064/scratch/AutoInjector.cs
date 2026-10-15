using System;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

public class AutoInjector {
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

    const byte VK_ESCAPE  = 0x1B;
    const byte VK_CONTROL = 0x11;
    const byte VK_RETURN  = 0x0D;
    const byte VK_V       = 0x56;
    const byte VK_J       = 0x4A;
    const byte VK_SHIFT   = 0x10;

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

    public static IntPtr FindDreamCampusWindow() {
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

    public static void InjectAutoScript(string scriptCode) {
        Attach();
        IntPtr hWnd = FindDreamCampusWindow();
        if (hWnd == IntPtr.Zero) {
            Console.WriteLine("DreamCampus window not found!");
            return;
        }

        Console.WriteLine("Bringing DreamCampus window to foreground: " + hWnd);
        SetForegroundWindow(hWnd);
        Thread.Sleep(500);

        RECT rect;
        GetWindowRect(hWnd, out rect);
        Console.WriteLine("Window Rect: " + rect.Left + "," + rect.Top + " -> " + rect.Right + "," + rect.Bottom);

        // Put script in clipboard
        Thread staThread = new Thread(() => {
            Clipboard.SetText(scriptCode);
        });
        staThread.SetApartmentState(ApartmentState.STA);
        staThread.Start();
        staThread.Join();
        Console.WriteLine("Script copied to clipboard");

        // 1. Focus DevTools: Press Ctrl+Shift+J (directly opens Console tab in Chrome/Edge!)
        Console.WriteLine("Sending Ctrl + Shift + J to open Console...");
        keybd_event(VK_CONTROL, 0, 0, 0);
        keybd_event(VK_SHIFT, 0, 0, 0);
        keybd_event(VK_J, 0, 0, 0);
        Thread.Sleep(100);
        keybd_event(VK_J, 0, KEYEVENTF_KEYUP, 0);
        keybd_event(VK_SHIFT, 0, KEYEVENTF_KEYUP, 0);
        keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0);
        Thread.Sleep(800);

        // 2. Paste script (Ctrl + V)
        Console.WriteLine("Sending Ctrl + V to paste script...");
        keybd_event(VK_CONTROL, 0, 0, 0);
        keybd_event(VK_V, 0, 0, 0);
        Thread.Sleep(100);
        keybd_event(VK_V, 0, KEYEVENTF_KEYUP, 0);
        keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0);
        Thread.Sleep(500);

        // 3. Press Enter
        Console.WriteLine("Sending Enter...");
        keybd_event(VK_RETURN, 0, 0, 0);
        Thread.Sleep(100);
        keybd_event(VK_RETURN, 0, KEYEVENTF_KEYUP, 0);
        Thread.Sleep(500);

        Console.WriteLine("Script injected successfully!");
    }

    public static void CaptureWindow(string savePath) {
        Attach();
        IntPtr hWnd = FindDreamCampusWindow();
        if (hWnd == IntPtr.Zero) return;
        RECT rect;
        GetWindowRect(hWnd, out rect);
        int w = rect.Right - rect.Left;
        int h = rect.Bottom - rect.Top;
        if (w <= 0 || h <= 0) return;

        using (Bitmap bmp = new Bitmap(w, h)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                IntPtr hdc = g.GetHdc();
                PrintWindow(hWnd, hdc, 2);
                g.ReleaseHdc(hdc);
            }
            bmp.Save(savePath, ImageFormat.Png);
            Console.WriteLine("Window captured: " + savePath);
        }
    }
}
