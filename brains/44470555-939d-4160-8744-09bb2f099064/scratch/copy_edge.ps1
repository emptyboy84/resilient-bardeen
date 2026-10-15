$profileDir = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Profile 1"
$scratch = "C:\Users\lg\.gemini\antigravity\brain\44470555-939d-4160-8744-09bb2f099064\scratch"

function Copy-LockedFile($src, $dst) {
    try {
        $fileStream = [System.IO.File]::Open($src, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
        $outStream = [System.IO.File]::Create($dst)
        $fileStream.CopyTo($outStream)
        $fileStream.Dispose()
        $outStream.Dispose()
        Write-Host "Copied $src -> $dst"
    } catch {
        Write-Host ("Failed to copy " + $src + " : " + $_.Exception.Message)
    }
}

$sessionsDir = Join-Path $profileDir "Sessions"
if (Test-Path $sessionsDir) {
    Get-ChildItem $sessionsDir | ForEach-Object {
        $target = Join-Path $scratch $_.Name
        Copy-LockedFile $_.FullName $target
    }
}

# Also copy History
$historyPath = Join-Path $profileDir "History"
if (Test-Path $historyPath) {
    Copy-LockedFile $historyPath (Join-Path $scratch "History.db")
}
