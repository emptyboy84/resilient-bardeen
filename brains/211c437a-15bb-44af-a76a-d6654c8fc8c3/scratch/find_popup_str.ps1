$bytes = [IO.File]::ReadAllBytes('C:\Program Files (x86)\LG Software\LG OSD\HotkeyManager.exe')
$str = [Text.Encoding]::Unicode.GetString($bytes)
$matches = [regex]::Matches($str, 'DisplayPopup[^\x00]*')
foreach ($m in $matches) {
    Write-Host $m.Value
}
