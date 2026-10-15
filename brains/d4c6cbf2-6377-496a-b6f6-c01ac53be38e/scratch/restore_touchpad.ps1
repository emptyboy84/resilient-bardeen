# LG 노트북 정밀 터치패드 원래 설정 복원 스크립트

Write-Host "[1/3] 터치패드 민감도 원래 값으로 복원 (AAPThreshold = 1)..." -ForegroundColor Yellow
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" -Name "AAPThreshold" -Value 1 -Type DWord

Write-Host "[2/3] 스크롤 줄 수 복원 (WheelScrollLines = 2)..." -ForegroundColor Yellow
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "WheelScrollLines" -Value "2" -Type String

Write-Host "[3/3] 포인터 가속도 원래 값으로 복원 (MouseSpeed = 1)..." -ForegroundColor Yellow
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseSpeed" -Value "1" -Type String
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold1" -Value "0" -Type String
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold2" -Value "0" -Type String

$signature = @"
[DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
public static extern bool SystemParametersInfo(uint uiAction, uint uiParam, IntPtr pvParam, uint fWinIni);

[DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam, uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
"@

try {
    $user32 = Add-Type -MemberDefinition $signature -Name "User32TouchpadRestore" -Namespace "Win32FunctionsRestore" -PassThru
    [Win32FunctionsRestore.User32TouchpadRestore]::SystemParametersInfo(105, 2, [IntPtr]::Zero, 3) | Out-Null
    
    $mouseParams = [System.Runtime.InteropServices.Marshal]::AllocHGlobal(12)
    [System.Runtime.InteropServices.Marshal]::Copy([int[]]@(0, 0, 1), 0, $mouseParams, 3)
    [Win32FunctionsRestore.User32TouchpadRestore]::SystemParametersInfo(4, 0, $mouseParams, 3) | Out-Null
    [System.Runtime.InteropServices.Marshal]::FreeHGlobal($mouseParams)
    
    $result = [UIntPtr]::Zero
    [Win32FunctionsRestore.User32TouchpadRestore]::SendMessageTimeout([IntPtr]0xffff, 0x001A, [UIntPtr]::Zero, "PrecisionTouchPad", 2, 2000, [ref]$result) | Out-Null
    [Win32FunctionsRestore.User32TouchpadRestore]::SendMessageTimeout([IntPtr]0xffff, 0x001A, [UIntPtr]::Zero, "Control Panel\Desktop", 2, 2000, [ref]$result) | Out-Null
} catch {
    Write-Warning "Win32 API 호출 중 알림: $_"
}

Write-Host ">> 원래 설정으로 성공적으로 복원되었습니다!" -ForegroundColor Green
