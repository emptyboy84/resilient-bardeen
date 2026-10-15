$asm = [System.Reflection.Assembly]::LoadFrom('C:\Program Files (x86)\LG Software\LG Control Center\LGDeviceCtrlLib.dll')
$ctrl = New-Object LGDeviceCtrlLib.LGDeviceController

$asmWmi = [System.Reflection.Assembly]::LoadFrom('C:\Program Files (x86)\LG Software\LG Control Center\WMIConn.dll')
$acpi = New-Object WMIConn.ACPIHelper

# 1. ACPI 0x30 to 0 (On)
$acpi.SetMethod2(0x30, 0)

# 2. LG OSD Registry to 0 (On)
$osdPath = 'HKCU:\Software\LGE\OSD'
if (-not (Test-Path $osdPath)) { New-Item -Path $osdPath -Force | Out-Null }
Set-ItemProperty -Path $osdPath -Name 'Touchpad' -Value 0 -Type DWord

# 3. Precision Touchpad to 1 (On, Leave on with mouse)
$ptpStatusPath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad\Status'
if (-not (Test-Path $ptpStatusPath)) { New-Item -Path $ptpStatusPath -Force | Out-Null }
Set-ItemProperty -Path $ptpStatusPath -Name 'Enabled' -Value 1 -Type DWord

$ptpPath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad'
if (-not (Test-Path $ptpPath)) { New-Item -Path $ptpPath -Force | Out-Null }
Set-ItemProperty -Path $ptpPath -Name 'LeaveOnWithMouse' -Value 1 -Type DWord

# 4. Fire notification to HotkeyManager
$fireMethod = [LGDeviceCtrlLib.LGDeviceController].GetMethod('Fire_TouchPadChanged', [Reflection.BindingFlags]'NonPublic,Instance')
if ($fireMethod) {
    $fireMethod.Invoke($ctrl, @(0))
}

Write-Host "SUCCESS: ACPI 0x30=$($acpi.GetMethod2(0x30)), TouchPadMode=$($ctrl.Get_TouchPadMode()), OSD=$((Get-ItemProperty $osdPath).Touchpad), PTP_Enabled=$((Get-ItemProperty $ptpStatusPath).Enabled)"
