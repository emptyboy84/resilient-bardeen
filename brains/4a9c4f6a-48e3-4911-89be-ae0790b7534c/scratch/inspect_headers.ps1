[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$tempCopy = Join-Path $env:TEMP "inspect_temp3.xlsx"
$item = Get-ChildItem -LiteralPath "C:\Users\lg\Desktop" | Where-Object { $_.Extension -eq ".xlsx" -and $_.Name -like "*CT*" } | Select-Object -First 1

$sourceStream = [System.IO.File]::Open($item.FullName, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$destStream = [System.IO.File]::Create($tempCopy)
$sourceStream.CopyTo($destStream)
$sourceStream.Close()
$destStream.Close()

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($tempCopy)

# Check sharedStrings.xml
$sstEntry = $zip.GetEntry("xl/sharedStrings.xml")
$sharedStrings = @()
if ($sstEntry) {
    $sr = New-Object System.IO.StreamReader($sstEntry.Open(), [System.Text.Encoding]::UTF8)
    $sstXml = $sr.ReadToEnd()
    $sr.Close()
    $matches = [regex]::Matches($sstXml, "<t[^>]*>(.*?)</t>")
    Write-Host "Total shared strings count: $($matches.Count)"
    for ($i = 0; $i -lt [Math]::Min(15, $matches.Count); $i++) {
        $val = $matches[$i].Groups[1].Value
        Write-Host "  String ${i}: $val"
    }
}

# Check sheet1 headers and data count
$s1Entry = $zip.GetEntry("xl/worksheets/sheet1.xml")
if ($s1Entry) {
    $sr = New-Object System.IO.StreamReader($s1Entry.Open(), [System.Text.Encoding]::UTF8)
    $s1Xml = $sr.ReadToEnd()
    $sr.Close()
    
    # Get row 1 cells
    if ($s1Xml -match "<row[^>]*r=`"1`"[^>]*>(.*?)</row>") {
        Write-Host "`nSheet 1 Header Row XML: $($Matches[1])"
    }
}

$zip.Dispose()
Remove-Item $tempCopy -Force
