using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using System.Windows.Automation;

public class UIInspector {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr OpenWindowStation(string lpszWinSta, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetProcessWindowStation(IntPtr hWinSta);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr OpenDesktop(string lpszDesktop, uint dwFlags, bool fInherit, uint dwDesiredAccess);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool SetThreadDesktop(IntPtr hDesktop);

    public static void Attach() {
        IntPtr hwinsta = OpenWindowStation("WinSta0", false, 0x037F);
        if (hwinsta != IntPtr.Zero) SetProcessWindowStation(hwinsta);
        IntPtr hdesk = OpenDesktop("default", 0, false, 0x01FF);
        if (hdesk != IntPtr.Zero) SetThreadDesktop(hdesk);
    }

    public static void Inspect(IntPtr hWnd) {
        Attach();
        var element = AutomationElement.FromHandle(hWnd);
        if (element == null) {
            Console.WriteLine("Could not get AutomationElement from handle");
            return;
        }

        Console.WriteLine("Root: " + element.Current.Name + " (" + element.Current.ControlType.ProgrammaticName + ")");
        PrintChildren(element, 0);
    }

    private static void PrintChildren(AutomationElement parent, int depth) {
        if (depth > 6) return;
        var cond = Condition.TrueCondition;
        var children = parent.FindAll(TreeScope.Children, cond);
        string indent = new string(' ', depth * 2);

        foreach (AutomationElement child in children) {
            try {
                var name = child.Current.Name;
                var ctype = child.Current.ControlType.ProgrammaticName;
                var autoId = child.Current.AutomationId;
                var rect = child.Current.BoundingRectangle;
                if (!string.IsNullOrEmpty(name) || !string.IsNullOrEmpty(autoId) || ctype.Contains("Button") || ctype.Contains("Edit")) {
                    Console.WriteLine(string.Format("{0}[{1}] Name: '{2}', Id: '{3}', Rect: ({4},{5},{6}x{7})", 
                        indent, ctype.Replace("ControlType.", ""), name, autoId, (int)rect.X, (int)rect.Y, (int)rect.Width, (int)rect.Height));
                }
                PrintChildren(child, depth + 1);
            } catch {}
        }
    }
}
