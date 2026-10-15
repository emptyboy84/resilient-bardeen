$tempCopy = Join-Path $env:TEMP "inspect_temp2.xlsx"
$item = Get-ChildItem -LiteralPath "C:\Users\lg\Desktop" | Where-Object { $_.Extension -eq ".xlsx" -and $_.Name -like "*CT*" } | Select-Object -First 1

$sourceStream = [System.IO.File]::Open($item.FullName, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$destStream = [System.IO.File]::Create($tempCopy)
$sourceStream.CopyTo($destStream)
$sourceStream.Close()
$destStream.Close()

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($tempCopy)

$wbEntry = $zip.GetEntry("xl/workbook.xml")
$sr = New-Object System.IO.StreamReader($wbEntry.Open(), [System.Text.Encoding]::UTF8)
$wbXml = $sr.ReadToEnd()
$sr.Close()

# Print workbook XML with sheets
[xml]$wbDoc = $wbXml
foreach ($sheet in $wbDoc.workbook.sheets.sheet) {
    Write-Host "Sheet Name: $($sheet.name), SheetId: $($sheet.sheetId), state: $($sheet.state)"
}

Write-Host "workbookView attributes:"
foreach ($wv in $wbDoc.workbook.bookViews.workbookView) {
    Write-Host "  visibility: $($wv.visibility), xWindow: $($wv.xWindow), yWindow: $($wv.yWindow), windowWidth: $($wv.windowWidth), windowHeight: $($wv.windowHeight)"
}

$zip.Dispose()
Remove-Item $tempCopy -Force
