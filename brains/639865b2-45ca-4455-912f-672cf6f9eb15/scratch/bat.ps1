$report = Join-Path $env:TEMP "battery_report.html"
$txt = Get-Content $report -Raw
$matches = [regex]::Matches($txt, '<td>\s*([\d,]+)\s*mWh\s*</td>')
foreach ($m in $matches) {
    Write-Host $m.Groups[1].Value "mWh"
}
