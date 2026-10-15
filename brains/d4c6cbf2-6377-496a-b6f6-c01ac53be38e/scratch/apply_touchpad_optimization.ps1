# LG 노트북 정밀 터치패드 최적화 적용 스크립트

Write-Host "[1/4] 터치패드 탭 딜레이 제거 (AAPThreshold = 0: 가장 민감함/지연 제로)..." -ForegroundColor Cyan
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad" -Name "AAPThreshold" -Value 0 -Type DWord

Write-Host "[2/4] 스크롤 줄 수 최적화 (WheelScrollLines = 4)..." -ForegroundColor Cyan
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "WheelScrollLines" -Value "4" -Type String

Write-Host "[3/4] 포인터 정확도/가속도 보정 (MouseSpeed = 0: 1:1 정밀 매핑)..." -ForegroundColor Cyan
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseSpeed" -Value "0" -Type String
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold1" -Value "0" -Type String
Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold2" -Value "0" -Type String

Write-Host "[4/4] 윈도우 시스템 설정 즉시 갱신 (SystemParametersInfo & WM_SETTINGCHANGE)..." -ForegroundColor Cyan

$signature = @"
[DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
public static extern bool SystemParametersInfo(uint uiAction, uint uiParam, IntPtr pvParam, uint fWinIni);

[DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam, uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
"@

try {
    $user32 = Add-Type -MemberDefinition $signature -Name "User32Touchpad" -Namespace "Win32Functions" -PassThru
    
    # SPI_SETWHEELSCROLLLINES = 0x0069 (105), SPIF_UPDATEINIFILE = 1, SPIF_SENDCHANGE = 2
    [Win32Functions.User32Touchpad]::SystemParametersInfo(105, 4, [IntPtr]::Zero, 3) | Out-Null
    
    # SPI_SETMOUSE = 0x0004 (4)
    # Param: array of 3 ints: [threshold1, threshold2, acceleration]
    $mouseParams = [System.Runtime.InteropServices.Marshal]::AllocHGlobal(12)
    [System.Runtime.InteropServices.Marshal]::Copy([int[]]@(0, 0, 0), 0, $mouseParams, 3)
    [Win32Functions.User32Touchpad]::SystemParametersInfo(4, 0, $mouseParams, 3) | Out-Null
    [System.Runtime.InteropServices.Marshal]::FreeHGlobal($mouseParams)
    
    # Broadcast WM_SETTINGCHANGE (0x001A)
    $result = [UIntPtr]::Zero
    [Win32Functions.User32Touchpad]::SendMessageTimeout([IntPtr]0xffff, 0x001A, [UIntPtr]::Zero, "PrecisionTouchPad", 2, 2000, [ref]$result) | Out-Null
    [Win32Functions.User32Touchpad]::SendMessageTimeout([IntPtr]0xffff, 0x001A, [UIntPtr]::Zero, "Control Panel\Desktop", 2, 2000, [ref]$result) | Out-Null
} catch {
    Write-Warning "Win32 API 호출 중 알림: $_"
}

Write-Host ">> 터치패드 최적화 설정이 성공적으로 완료 및 적용되었습니다!" -ForegroundColor Green
