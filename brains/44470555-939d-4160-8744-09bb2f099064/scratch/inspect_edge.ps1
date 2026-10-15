# 1. Check Edge command lines
Write-Host "=== Edge Process CommandLine Arguments ==="
Get-CimInstance Win32_Process -Filter "name = 'msedge.exe'" | ForEach-Object {
    if ($_.CommandLine -match "http|www|file|\.html") {
        Write-Host "PID: $($_.ProcessId) | CommandLine: $($_.CommandLine)"
    }
}

# 2. UI Automation to inspect all desktop windows
Write-Host "`n=== UI Automation Desktop Windows ==="
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes

$root = [System.Windows.Automation.AutomationElement]::RootElement
$condition = [System.Windows.Automation.Condition]::TrueCondition
$windows = $root.FindAll([System.Windows.Automation.TreeScope]::Children, $condition)

foreach ($w in $windows) {
    try {
        $name = $w.Current.Name
        $procId = $w.Current.ProcessId
        $class = $w.Current.ClassName
        $isOff = $w.Current.IsOffscreen
        if ($name -ne "" -or $class -match "Edge|Chrome") {
            Write-Host "ProcessId: $procId | Class: $class | Offscreen: $isOff | Name: $name"
        }
    } catch {}
}

# 3. Find Edge specific UI elements (Tabs, Address bar)
Write-Host "`n=== Edge Tabs / UI Elements ==="
$edgeProcIds = (Get-Process msedge -ErrorAction SilentlyContinue).Id
foreach ($w in $windows) {
    if ($edgeProcIds -contains $w.Current.ProcessId) {
        Write-Host "Edge Window Found: Name='$($w.Current.Name)' Class='$($w.Current.ClassName)'"
        # Find tab items or document items
        $tabCondition = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::TabItem)
        $tabs = $w.FindAll([System.Windows.Automation.TreeScope]::Descendants, $tabCondition)
        foreach ($tab in $tabs) {
            Write-Host "  -> Tab: $($tab.Current.Name)"
        }
        
        # Find Edit/Address bar
        $editCondition = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Edit)
        $edits = $w.FindAll([System.Windows.Automation.TreeScope]::Descendants, $editCondition)
        foreach ($edit in $edits) {
            Write-Host "  -> Edit/Address: Name='$($edit.Current.Name)' Value='$($edit.Current.Value)'"
        }
        
        # Find Document items
        $docCondition = New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::ControlTypeProperty, [System.Windows.Automation.ControlType]::Document)
        $docs = $w.FindAll([System.Windows.Automation.TreeScope]::Descendants, $docCondition)
        foreach ($doc in $docs) {
            Write-Host "  -> Document: Name='$($doc.Current.Name)'"
        }
    }
}
