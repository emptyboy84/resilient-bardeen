const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

const BAE_RANGES = [
  [702, 801],
  [1001, 1100],
  [1801, 1900],
  [2401, 2500],
  [3301, 3400],
  [5001, 5500],
  [11847, 12346]
];

function isBaeRow(r) {
  for (const [start, end] of BAE_RANGES) {
    if (r >= start && r <= end) return true;
  }
  return false;
}

async function verifyFinalFile() {
  const targetPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetPath);
  const ws = wb.getWorksheet('기업 정보');

  let orangeFillCount = 0;
  for (let r = 2; r <= 20434; r++) {
    if (!isBaeRow(r)) continue;
    const row = ws.getRow(r);
    for (let c = 1; c <= 25; c++) {
      const cell = row.getCell(c);
      if (cell && cell.fill && cell.fill.fgColor) {
        const argb = cell.fill.fgColor.argb;
        if (argb === 'FFFFA500' || argb === 'FFA500') {
          orangeFillCount++;
        }
      }
    }
  }

  console.log('=== 최종 저장 파일 검증 결과 ===');
  console.log('주황색 마킹 셀 총 수:', orangeFillCount, '(목표: 3026개)');

  const testRows = [5076, 5097, 5219, 5280, 11881, 5237, 5060, 12288, 11847, 11955];
  testRows.forEach(r => {
    const row = ws.getRow(r);
    console.log(`[행 ${r}] ${row.getCell(3).value}:`);
    console.log(`   법인번호: ${row.getCell(25).value}`);
    console.log(`   주소: ${row.getCell(7).value}`);
  });
}

verifyFinalFile().catch(err => console.error(err));
