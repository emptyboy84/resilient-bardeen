$asm = [System.Reflection.Assembly]::LoadFrom('C:\Program Files (x86)\LG Software\LG Control Center\WMIConn.dll')
$acpi = New-Object WMIConn.ACPIHelper

Write-Host "Initial GetMethod2(0x30): " ($acpi.GetMethod2(0x30))
$ret = $acpi.SetMethod2(0x30, 0)
Write-Host "SetMethod2(0x30, 0) result: $ret"
Write-Host "New GetMethod2(0x30): " ($acpi.GetMethod2(0x30))
