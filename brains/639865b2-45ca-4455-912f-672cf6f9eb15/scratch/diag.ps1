$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=== 1. 하드웨어 장치 에러 코드 점검 ==="
$problemDevices = Get-PnpDevice | Where-Object { $_.Problem -ne 'CM_PROB_NONE' -and $_.Class -in @('Mouse','HIDClass','System') }
if ($problemDevices) {
    $problemDevices | Select-Object FriendlyName, InstanceId, Problem, Status | Format-Table -AutoSize
} else {
    Write-Host "[정상] 마우스 및 터치패드 관련 하드웨어에 등록된 오류 코드가 없습니다."
}

Write-Host "`n=== 2. 터치패드 드라이버 정보 ==="
Get-CimInstance Win32_PnPSignedDriver | Where-Object { 
    $_.DeviceClass -in @('MOUSE','HIDCLASS') -and 
    ($_.DeviceName -match 'Synaptics|I2C|Touch|Pad' -or $_.Description -match 'Synaptics|I2C|Touch|Pad') 
} | Select-Object DeviceName, DriverVersion, DriverDate, Manufacturer | Format-Table -AutoSize

Write-Host "`n=== 3. 시스템 이벤트 로그 (입력 장치 오류/경고) ==="
$logEvents = Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddDays(-14)} -ErrorAction SilentlyContinue | 
    Where-Object { $_.ProviderName -match 'HID|i2c|Synaptics|mouclass' }
if ($logEvents) {
    $logEvents | Select-Object TimeCreated, ProviderName, LevelDisplayName, Message | Format-Table -AutoSize
} else {
    Write-Host "[정상] 최근 14일간 터치패드/입력장치 충돌 및 오류 이벤트가 0건입니다."
}

Write-Host "`n=== 4. 배터리 상태 점검 (스웰링/열화 여부) ==="
$reportPath = Join-Path $env:TEMP "battery_report.html"
powercfg /batteryreport /output $reportPath | Out-Null
if (Test-Path $reportPath) {
    $htmlContent = Get-Content $reportPath -Raw
    if ($htmlContent -match 'DESIGN CAPACITY</td>\s*<td[^>]*>([\d,]+\s*mWh)</td>') {
        $designCap = $matches[1]
    }
    if ($htmlContent -match 'FULL CHARGE CAPACITY</td>\s*<td[^>]*>([\d,]+\s*mWh)</td>') {
        $fullCap = $matches[1]
    }
    Write-Host "설계 배터리 용량: $designCap"
    Write-Host "현재 완충 배터리: $fullCap"
}
