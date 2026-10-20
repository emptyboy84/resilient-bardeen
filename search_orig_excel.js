const fs = require('fs');

// We can check if python has openpyxl or check raw xml or search in cretap_missing_phone_targets.json
// Let's check python with openpyxl
const { execSync } = require('child_process');
try {
  const res = execSync('python -c "import openpyxl; wb=openpyxl.load_workbook(r\'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달 (1).xlsx\', read_only=True); ws=wb.active; [print(f\'Row {i+1}: {row}\') for i, row in enumerate(ws.iter_rows(values_only=True)) if any(\'923-0405\' in str(c) or \'9230405\' in str(c) or \'0405\' in str(c) for c in row if c)]"').toString();
  console.log('Openpyxl search result:', res);
} catch (e) {
  console.log('Python error:', e.message);
}
