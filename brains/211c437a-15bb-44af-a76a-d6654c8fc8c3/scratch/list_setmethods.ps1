$asm = [System.Reflection.Assembly]::LoadFrom('C:\Program Files (x86)\LG Software\LG Control Center\WMIConn.dll')
$t = $asm.GetType('WMIConn.ACPIHelper')
$t.GetMethods() | Where-Object { $_.Name -match 'SetMethod' } | ForEach-Object {
    $p = $_.GetParameters() | ForEach-Object { "$($_.ParameterType.Name) $($_.Name)" }
    Write-Host "$($_.ReturnType.Name) $($_.Name)($($p -join ', '))"
}
