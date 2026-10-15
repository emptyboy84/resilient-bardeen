using System;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

public class DirectInjector {
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
    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
    [DllImport("user32.dll")]
    public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdcBmp, uint nFlags);

    const uint KEYEVENTF_KEYUP = 0x0002;
    const byte VK_CONTROL = 0x11;
    const byte VK_SHIFT   = 0x10;
    const byte VK_J       = 0x4A;
    const byte VK_V       = 0x56;
    const byte VK_RETURN  = 0x0D;

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

    public static void SendKey(byte vk, byte modifier1 = 0, byte modifier2 = 0) {
        if (modifier1 != 0) keybd_event(modifier1, 0, 0, 0);
        if (modifier2 != 0) keybd_event(modifier2, 0, 0, 0);
        keybd_event(vk, 0, 0, 0);
        Thread.Sleep(50);
        keybd_event(vk, 0, KEYEVENTF_KEYUP, 0);
        if (modifier2 != 0) keybd_event(modifier2, 0, KEYEVENTF_KEYUP, 0);
        if (modifier1 != 0) keybd_event(modifier1, 0, KEYEVENTF_KEYUP, 0);
        Thread.Sleep(100);
    }

    public static void SetClipboard(string text) {
        Thread staThread = new Thread(() => {
            Clipboard.SetText(text);
        });
        staThread.SetApartmentState(ApartmentState.STA);
        staThread.Start();
        staThread.Join();
    }

    public static void Execute(string scriptCode, string capturePath) {
        Attach();
        IntPtr hWnd = FindWindow();
        if (hWnd == IntPtr.Zero) {
            Console.WriteLine("Window not found");
            return;
        }

        SetForegroundWindow(hWnd);
        Thread.Sleep(500);

        // 1. Open Console via Ctrl+Shift+J
        Console.WriteLine("Opening Console via Ctrl+Shift+J...");
        SendKey(VK_J, VK_CONTROL, VK_SHIFT);
        Thread.Sleep(1500);

        // 2. Type 'allow pasting' just in case DevTools requires it
        SetClipboard("allow pasting");
        SendKey(VK_V, VK_CONTROL);
        SendKey(VK_RETURN);
        Thread.Sleep(500);

        // 3. Paste actual script
        Console.WriteLine("Pasting Auto-Next script...");
        SetClipboard(scriptCode);
        SendKey(VK_V, VK_CONTROL);
        Thread.Sleep(300);
        SendKey(VK_RETURN);
        Thread.Sleep(2000);

        // Capture window
        RECT rect;
        GetWindowRect(hWnd, out rect);
        int w = rect.Right - rect.Left;
        int h = rect.Bottom - rect.Top;
        using (Bitmap bmp = new Bitmap(w, h)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                IntPtr hdc = g.GetHdc();
                PrintWindow(hWnd, hdc, 2);
                g.ReleaseHdc(hdc);
            }
            bmp.Save(capturePath, ImageFormat.Png);
            Console.WriteLine("Screenshot saved: " + capturePath);
        }
    }
}
