$asm = [System.Reflection.Assembly]::LoadFrom('C:\Program Files (x86)\LG Software\LG Control Center\LGDeviceCtrlLib.dll')
$ctrl = New-Object LGDeviceCtrlLib.LGDeviceController
$field = [LGDeviceCtrlLib.LGDeviceController].GetField('ACPIController', [Reflection.BindingFlags]'NonPublic,Instance,Public')
$acpi = $field.GetValue($ctrl)

Write-Host "ModelName: " ($ctrl.GetType().GetMethod('GetModelName', [Reflection.BindingFlags]'NonPublic,Static,Public').Invoke($null, @()))
Write-Host "ACPIController 0x30: " ($acpi.GetMethod(0x30))
Write-Host "ACPIController 0x409: " ($acpi.GetMethod(0x409))
Write-Host "Get_TouchPadMode: " ($ctrl.Get_TouchPadMode())
