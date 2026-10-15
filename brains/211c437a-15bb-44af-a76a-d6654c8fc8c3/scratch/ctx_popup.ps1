$bytes = [IO.File]::ReadAllBytes('C:\Program Files (x86)\LG Software\LG OSD\HotkeyManager.exe')
$str = [Text.Encoding]::Unicode.GetString($bytes)
$idx = $str.IndexOf('DisplayPopup.exe')
if ($idx -ge 0) {
    $start = [Math]::Max(0, $idx - 200)
    $len = [Math]::Min(500, $str.Length - $start)
    Write-Host ($str.Substring($start, $len) -replace "`0", " ")
}
