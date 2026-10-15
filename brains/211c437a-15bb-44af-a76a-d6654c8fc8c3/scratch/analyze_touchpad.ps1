$asm = [System.Reflection.Assembly]::LoadFrom('C:\Program Files (x86)\LG Software\LG Control Center\LGDeviceCtrlLib.dll')
$type = $asm.GetType('LGDeviceCtrlLib.LGDeviceController')
$m = $type.GetMethod('Set_TouchPadMode')
$bytes = $m.GetMethodBody().GetILAsByteArray()
$mod = $m.Module

Write-Host "Set_TouchPadMode IL analysis:"
for ($i = 0; $i -lt $bytes.Length; $i++) {
    $b = $bytes[$i]
    if ($b -in @(0x72, 0x28, 0x6F, 0x7E, 0x7B, 0x7D)) {
        $tok = [BitConverter]::ToInt32($bytes, $i+1)
        try {
            $mem = $mod.ResolveMember($tok)
            Write-Host ('{0:X4}: op_{1:X2} {2} ({3})' -f $i, $b, $mem.Name, $mem.DeclaringType.Name)
        } catch {
            try {
                $str = $mod.ResolveString($tok)
                Write-Host ('{0:X4}: string "{1}"' -f $i, $str)
            } catch {}
        }
        $i += 4
    }
}

Write-Host "`nGet_TouchPadMode IL analysis:"
$m2 = $type.GetMethod('Get_TouchPadMode')
$bytes2 = $m2.GetMethodBody().GetILAsByteArray()
for ($i = 0; $i -lt $bytes2.Length; $i++) {
    $b = $bytes2[$i]
    if ($b -in @(0x72, 0x28, 0x6F, 0x7E, 0x7B, 0x7D)) {
        $tok = [BitConverter]::ToInt32($bytes2, $i+1)
        try {
            $mem = $mod.ResolveMember($tok)
            Write-Host ('{0:X4}: op_{1:X2} {2} ({3})' -f $i, $b, $mem.Name, $mem.DeclaringType.Name)
        } catch {
            try {
                $str = $mod.ResolveString($tok)
                Write-Host ('{0:X4}: string "{1}"' -f $i, $str)
            } catch {}
        }
        $i += 4
    }
}
