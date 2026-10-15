Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceFile = "C:\Users\lg\Desktop\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx"
$tempCopy = "C:\Users\lg\.gemini\antigravity\brain\4a9c4f6a-48e3-4911-89be-ae0790b7534c\scratch\temp_copy.xlsx"

Write-Output "Source exists: $(Test-Path $sourceFile)"

# Open with FileShare.ReadWrite so even if Excel has it open, we can read it
$fileStream = [System.IO.File]::Open($sourceFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$outStream = [System.IO.File]::Create($tempCopy)
$fileStream.CopyTo($outStream)
$fileStream.Close()
$outStream.Close()

Write-Output "Copied to temp. Size: $( (Get-Item $tempCopy).Length ) bytes"

$zip = [System.IO.Compression.ZipFile]::OpenRead($tempCopy)

Write-Output "=== Archive Entries ==="
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like "*sheet*" -or $entry.FullName -like "*workbook*" -or $entry.FullName -like "*sharedStrings*") {
        Write-Output "$($entry.FullName) ($($entry.Length) bytes, compressed $($entry.CompressedLength))"
    }
}

# Read workbook.xml
$wbEntry = $zip.GetEntry("xl/workbook.xml")
if ($wbEntry) {
    $reader = New-Object System.IO.StreamReader($wbEntry.Open())
    $wbXml = $reader.ReadToEnd()
    $reader.Close()
    Write-Output "=== xl/workbook.xml ==="
    Write-Output $wbXml
}

# Read sheet1.xml (first 2000 chars and check sheetView / sheetData)
$s1Entry = $zip.GetEntry("xl/worksheets/sheet1.xml")
if ($s1Entry) {
    $reader = New-Object System.IO.StreamReader($s1Entry.Open())
    $s1Xml = $reader.ReadToEnd()
    $reader.Close()
    Write-Output "=== xl/worksheets/sheet1.xml Length ==="
    Write-Output "Length: $($s1Xml.Length)"
    
    # Check sheetViews
    if ($s1Xml -match "<sheetViews>.*?</sheetViews>") {
        Write-Output "=== sheetViews ==="
        Write-Output $Matches[0]
    }
    
    # Check cols
    if ($s1Xml -match "<cols>.*?</cols>") {
        Write-Output "=== cols ==="
        Write-Output $Matches[0]
    }
    
    # Check if there are rows/data
    if ($s1Xml -match "<sheetData>.*?</sheetData>") {
        $dataPart = $Matches[0]
        Write-Output "sheetData length: $($dataPart.Length)"
        Write-Output "Sample sheetData: $( $dataPart.Substring(0, [Math]::Min(1000, $dataPart.Length)) )"
    } elseif ($s1Xml -match "<sheetData/>") {
        Write-Output "sheetData is EMPTY (<sheetData/>)!"
    }
}

$zip.Dispose()
