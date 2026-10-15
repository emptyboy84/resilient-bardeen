$item = Get-ChildItem -LiteralPath "C:\Users\lg\Desktop" | Where-Object { $_.Extension -eq ".xlsx" -and $_.Name -like "*CT*" } | Select-Object -First 1

if (-not $item) {
    Write-Host "File not found!"
    exit 1
}

Write-Host "Found file: $($item.FullName)"
Write-Host "Size: $($item.Length) bytes"

$tempCopy = Join-Path $env:TEMP "inspect_temp.xlsx"
if (Test-Path $tempCopy) { Remove-Item $tempCopy -Force }

# Copy with file share
$sourceStream = [System.IO.File]::Open($item.FullName, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$destStream = [System.IO.File]::Create($tempCopy)
$sourceStream.CopyTo($destStream)
$sourceStream.Close()
$destStream.Close()

Write-Host "Copied to temp: $tempCopy (Size: $( (Get-Item $tempCopy).Length ))"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($tempCopy)

Write-Host "`n--- Sheets in workbook.xml ---"
$wbEntry = $zip.GetEntry("xl/workbook.xml")
if ($wbEntry) {
    $sr = New-Object System.IO.StreamReader($wbEntry.Open(), [System.Text.Encoding]::UTF8)
    $wbXml = $sr.ReadToEnd()
    $sr.Close()
    Write-Host $wbXml
}

Write-Host "`n--- Checking worksheets ---"
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like "xl/worksheets/*.xml") {
        Write-Host "`nWorksheet entry: $($entry.FullName), size: $($entry.Length)"
        $sr = New-Object System.IO.StreamReader($entry.Open(), [System.Text.Encoding]::UTF8)
        $sheetXml = $sr.ReadToEnd()
        $sr.Close()
        
        # Check sheetViews
        if ($sheetXml -match "(<sheetViews>.*?</sheetViews>)") {
            Write-Host "SheetViews: $($Matches[1])"
        }
        
        # Check dimension
        if ($sheetXml -match "(<dimension[^>]*/>)") {
            Write-Host "Dimension: $($Matches[1])"
        }
        
        # Check cols
        if ($sheetXml -match "(<cols>.*?</cols>)") {
            Write-Host "Cols: $($Matches[1])"
        }
        
        # Check row count or hidden rows
        $rows = [regex]::Matches($sheetXml, "<row\b[^>]*>")
        Write-Host "Total <row> tags: $($rows.Count)"
        $hiddenRows = 0
        $zeroHeightRows = 0
        foreach ($r in $rows) {
            if ($r.Value -match 'hidden="1"' -or $r.Value -match 'hidden="true"') {
                $hiddenRows++
            }
            if ($r.Value -match 'ht="0"') {
                $zeroHeightRows++
            }
        }
        Write-Host "Hidden rows: $hiddenRows, Zero height rows: $zeroHeightRows"
        if ($rows.Count -gt 0) {
            Write-Host "Sample first 5 rows: $( ($rows | Select-Object -First 5 | ForEach-Object { $_.Value }) -join ' ' )"
        }
    }
}

$zip.Dispose()
Remove-Item $tempCopy -Force
