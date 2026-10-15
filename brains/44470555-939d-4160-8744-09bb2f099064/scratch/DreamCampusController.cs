using System;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using System.Windows.Automation;

public class DreamCampusController {
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
    public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdcBmp, uint nFlags);

    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);

    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int X, int Y);

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
                        Console.WriteLine("Found DreamCampus Window: " + title + " (HWND: " + hWnd + ")");
                        found = hWnd;
                        return false;
                    }
                }
                return true;
            }, IntPtr.Zero);
        }
        return found;
    }

    public static void CaptureWindow(IntPtr hWnd, string savePath) {
        RECT rect;
        GetWindowRect(hWnd, out rect);
        int width = rect.Right - rect.Left;
        int height = rect.Bottom - rect.Top;
        if (width <= 0 || height <= 0) return;

        using (Bitmap bmp = new Bitmap(width, height)) {
            using (Graphics g = Graphics.FromImage(bmp)) {
                IntPtr hdc = g.GetHdc();
                PrintWindow(hWnd, hdc, 2); // PW_RENDERFULLCONTENT = 2
                g.ReleaseHdc(hdc);
            }
            bmp.Save(savePath, ImageFormat.Png);
            Console.WriteLine("Saved screenshot to: " + savePath + " (" + width + "x" + height + ")");
        }
    }

    public static void CaptureFullScreen(string savePath) {
        Attach();
        var bounds = System.Windows.Forms.Screen.PrimaryScreen.Bounds;
        using (Bitmap bitmap = new Bitmap(bounds.Width, bounds.Height)) {
            using (Graphics g = Graphics.FromImage(bitmap)) {
                g.CopyFromScreen(bounds.Location, Point.Empty, bounds.Size);
            }
            bitmap.Save(savePath, ImageFormat.Png);
            Console.WriteLine("Saved FullScreen to " + savePath);
        }
    }
}
