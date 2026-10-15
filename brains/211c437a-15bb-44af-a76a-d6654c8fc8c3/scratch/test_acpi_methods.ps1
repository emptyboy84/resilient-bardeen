$asm = [System.Reflection.Assembly]::LoadFrom('C:\Program Files (x86)\LG Software\LG Control Center\WMIConn.dll')
$acpi = New-Object WMIConn.ACPIHelper

Write-Host "GetPrefix: " ($acpi.GetPrefix())
Write-Host "GetMethod(0x30): " ($acpi.GetMethod(0x30))
Write-Host "GetMethod2(0x30): " ($acpi.GetMethod2(0x30))
