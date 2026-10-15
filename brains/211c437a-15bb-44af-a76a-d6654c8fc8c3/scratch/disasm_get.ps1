$asm = [System.Reflection.Assembly]::LoadFrom('C:\Program Files (x86)\LG Software\LG Control Center\LGDeviceCtrlLib.dll')
$type = $asm.GetType('LGDeviceCtrlLib.LGDeviceController')
$m = $type.GetMethod('Get_TouchPadMode')
$bytes = $m.GetMethodBody().GetILAsByteArray()
$mod = $m.Module

Write-Host "Get_TouchPadMode full bytecode with byte offsets:"
for ($i = 0; $i -lt $bytes.Length; $i++) {
    $offset = $i
    $b = $bytes[$i]
    Write-Host -NoNewline ('{0:X4}: {1:X2} ' -f $offset, $b)
    if ($b -in @(0x72, 0x28, 0x6F, 0x7E, 0x7B, 0x7D, 0x20)) {
        $val = [BitConverter]::ToInt32($bytes, $i+1)
        Write-Host -NoNewline ('[0x{0:X8}] ' -f $val)
        try {
            $mem = $mod.ResolveMember($val)
            Write-Host -NoNewline ('({0}.{1}) ' -f $mem.DeclaringType.Name, $mem.Name)
        } catch {
            try {
                $str = $mod.ResolveString($val)
                Write-Host -NoNewline ('("{0}") ' -f $str)
            } catch {}
        }
        $i += 4
    }
    Write-Host ""
}
