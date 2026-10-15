[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$files = Get-ChildItem "C:\Users\lg\Desktop\오늘\*.csv"
Write-Host "Found files:"
$files | ForEach-Object { Write-Host $_.FullName }

$targetFile = $files[0].FullName
$lines = [System.IO.File]::ReadAllLines($targetFile)
Write-Host "Total raw lines: $($lines.Length)"

$nonEmptyLines = 0
$lastIndex = 0
$authors = @{}

for ($i = 1; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    if (-not [string]::IsNullOrWhiteSpace($line) -and $line.Trim(',') -ne '') {
        $nonEmptyLines++
        $lastIndex = $i + 1
        $parts = $line.Split(',')
        $author = $parts[0]
        if (-not $authors.ContainsKey($author)) {
            $authors[$author] = 0
        }
        $authors[$author]++
    }
}

Write-Host "Non-empty rows count: $nonEmptyLines"
Write-Host "Last non-empty row line number: $lastIndex"
Write-Host "Author counts:"
$authors.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    Write-Host "$($_.Key): $($_.Value)"
}
