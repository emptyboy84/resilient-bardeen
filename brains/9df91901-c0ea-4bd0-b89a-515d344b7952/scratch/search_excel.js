const fs = require('fs');
const child_process = require('child_process');

const psScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Directory]::GetFiles('data', '*.xlsx') | ForEach-Object {
    $name = $_
    Write-Output ("Checking: " + $name)
    $zip = [System.IO.Compression.ZipFile]::OpenRead($name)
    $entry = $zip.GetEntry('xl/sharedStrings.xml')
    if ($entry) {
        $stream = $entry.Open()
        $sr = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
        $str = $sr.ReadToEnd()
        $stream.Close()
        if ($str.IndexOf([char]0xBE44 + [char]0xC804 + [char]0xC870 + [char]0xC774) -ge 0) {
            Write-Output ("MATCH 비전조이: " + $name)
        }
        if ($str.IndexOf([char]0xC774 + [char]0xAD6C + [char]0xCC3D) -ge 0) {
            Write-Output ("MATCH 이구창: " + $name)
        }
        if ($str.IndexOf("747-6799") -ge 0) {
            Write-Output ("MATCH 747-6799: " + $name)
        }
    }
    $zip.Dispose()
}
Write-Output "DONE"
`;

const b64 = Buffer.from(psScript, 'utf16le').toString('base64');
const out = child_process.execSync('powershell -EncodedCommand ' + b64, { encoding: 'utf-8' });
console.log(out);
