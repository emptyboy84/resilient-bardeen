Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Write-Host "=== Edge Windows ==="
Get-Process msedge -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -ne '' } | Select-Object Id, ProcessName, MainWindowTitle | Format-Table -AutoSize

Write-Host "=== All Visible Windows ==="
Get-Process | Where-Object { $_.MainWindowTitle -ne '' } | Select-Object Id, ProcessName, MainWindowTitle | Format-Table -AutoSize

# Capture all screens
$screens = [System.Windows.Forms.Screen]::AllScreens
$i = 0
foreach ($screen in $screens) {
    $bounds = $screen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
    $path = "C:\Users\lg\.gemini\antigravity\brain\44470555-939d-4160-8744-09bb2f099064\scratch\screen_$i.png"
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Saved screen $i to $path (Bounds: $($bounds.Width)x$($bounds.Height) at $($bounds.X),$($bounds.Y))"
    $i++
}
