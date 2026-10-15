$asm = [System.Reflection.Assembly]::LoadFrom('C:\Program Files (x86)\LG Software\LG Control Center\LGDeviceCtrlLib.dll')
$ctrl = New-Object LGDeviceCtrlLib.LGDeviceController
$field = [LGDeviceCtrlLib.LGDeviceController].GetField('ACPIController', [Reflection.BindingFlags]'NonPublic,Instance,Public')
$acpi = $field.GetValue($ctrl)

Write-Host "--- BEFORE ---"
Write-Host "ACPI 0x30: " ($acpi.GetMethod(0x30))
Write-Host "TouchPadMode: " ($ctrl.Get_TouchPadMode())
$regOsd = Get-ItemProperty -Path 'HKCU:\Software\LGE\OSD' -Name 'Touchpad' -ErrorAction SilentlyContinue
Write-Host "Registry HKCU\Software\LGE\OSD Touchpad: " ($regOsd.Touchpad)

Write-Host "`n--- CALLING Set_TouchPadMode(0) ---"
$setRes = $ctrl.Set_TouchPadMode(0)
Write-Host "Set_TouchPadMode(0) returned: $setRes"

Write-Host "`n--- AFTER ---"
Write-Host "ACPI 0x30: " ($acpi.GetMethod(0x30))
Write-Host "TouchPadMode: " ($ctrl.Get_TouchPadMode())
$regOsdAfter = Get-ItemProperty -Path 'HKCU:\Software\LGE\OSD' -Name 'Touchpad' -ErrorAction SilentlyContinue
Write-Host "Registry HKCU\Software\LGE\OSD Touchpad: " ($regOsdAfter.Touchpad)
