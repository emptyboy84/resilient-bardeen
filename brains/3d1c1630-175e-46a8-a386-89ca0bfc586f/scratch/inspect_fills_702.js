const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function inspectFills702() {
  const currentPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(currentPath);
  const ws = wb.getWorksheet('기업 정보');

  const fillTypes = {};
  for (let r = 702; r <= 5500; r++) {
    const row = ws.getRow(r);
    const val = row.getCell(1).value;
    if (val && String(val).includes('배현명')) {
      for (let c = 1; c <= 58; c++) {
        const fill = row.getCell(c).fill;
        if (fill) {
          const key = JSON.stringify(fill);
          fillTypes[key] = (fillTypes[key] || 0) + 1;
        }
      }
    }
  }

  console.log('Fill types found in 702-5500:');
  console.log(JSON.stringify(fillTypes, null, 2));

  // Also check non-empty fill types in 11847-12346 in currentPath
  const fillTypes11847 = {};
  for (let r = 11847; r <= 12346; r++) {
    const row = ws.getRow(r);
    for (let c = 1; c <= 58; c++) {
      const fill = row.getCell(c).fill;
      if (fill) {
        const key = JSON.stringify(fill);
        fillTypes11847[key] = (fillTypes11847[key] || 0) + 1;
      }
    }
  }
  console.log('\nFill types found in 11847-12346 (currentPath):');
  console.log(JSON.stringify(fillTypes11847, null, 2));
}

inspectFills702().catch(err => console.error(err));
