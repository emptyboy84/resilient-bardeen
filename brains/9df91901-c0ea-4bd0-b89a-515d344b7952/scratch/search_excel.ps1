Add-Type -AssemblyName System.IO.Compression.FileSystem
$files = Get-ChildItem "data\*.xlsx"
foreach ($f in $files) {
    Write-Host "Checking: $($f.FullName)"
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($f.FullName)
        $entry = $zip.GetEntry("xl/sharedStrings.xml")
        if ($entry) {
            $stream = $entry.Open()
            $reader = New-Object System.IO.StreamReader($stream)
            $content = $reader.ReadToEnd()
            $stream.Close()
            if ($content.Contains("비전조이")) {
                Write-Host "Found 비전조이 in $($f.Name)"
            }
            if ($content.Contains("이구창")) {
                Write-Host "Found 이구창 in $($f.Name)"
            }
            if ($content.Contains("747-6799")) {
                Write-Host "Found 747-6799 in $($f.Name)"
            }
        }
        $zip.Dispose()
    } catch {
        Write-Host "Error reading $($f.Name): $_"
    }
}
Write-Host "Done checking excel files."
