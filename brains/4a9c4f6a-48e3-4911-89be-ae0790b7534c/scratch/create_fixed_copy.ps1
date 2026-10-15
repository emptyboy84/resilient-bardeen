$desktopItem = Get-ChildItem -LiteralPath "C:\Users\lg\Desktop" | Where-Object { $_.Extension -eq ".xlsx" -and $_.Name -like "*CT*" } | Select-Object -First 1

$fixedCopy = Join-Path "C:\Users\lg\Desktop" ($desktopItem.BaseName + "_fixed.xlsx")
Write-Host "Creating fixed copy at: $fixedCopy"

# Copy source to fixed copy
$sourceStream = [System.IO.File]::Open($desktopItem.FullName, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$destStream = [System.IO.File]::Create($fixedCopy)
$sourceStream.CopyTo($destStream)
$sourceStream.Close()
$destStream.Close()

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

# Open zip for update
$zip = [System.IO.Compression.ZipFile]::Open($fixedCopy, [System.IO.Compression.ZipArchiveMode]::Update)

# Read and fix xl/workbook.xml
$wbEntry = $zip.GetEntry("xl/workbook.xml")
$sr = New-Object System.IO.StreamReader($wbEntry.Open(), [System.Text.Encoding]::UTF8)
$wbXml = $sr.ReadToEnd()
$sr.Close()

# Remove visibility="hidden"
$fixedWbXml = $wbXml -replace 'visibility="hidden"', ''

# Write back to xl/workbook.xml
$wbEntry.Delete()
$newWbEntry = $zip.CreateEntry("xl/workbook.xml", [System.IO.Compression.CompressionLevel]::Optimal)
$sw = New-Object System.IO.StreamWriter($newWbEntry.Open(), [System.Text.Encoding]::UTF8)
$sw.Write($fixedWbXml)
$sw.Close()

$zip.Dispose()

Write-Host "Successfully created: $fixedCopy (Size: $( (Get-Item $fixedCopy).Length ))"
