const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');

async function inspect20261014Rows() {
  const f = 'C:\\Users\\lg\\Desktop\\Today\\부산기업_전화번호검증_완료본_20261014.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(f);
  const ws = wb.worksheets[0];

  console.log('--- Rows 275-295 in 부산기업_전화번호검증_완료본_20261014.xlsx ---');
  for (let r = 275; r <= 295; r++) {
    const row = ws.getRow(r);
    console.log(`R${r}: seq=${row.getCell(1).value}, name=${row.getCell(2).value}, phone=${row.getCell(10).value}`);
  }

  let filled = 0, empty = 0;
  for (let r = 2; r <= ws.rowCount; r++) {
    const p = row = ws.getRow(r).getCell(10).value;
    if (p && String(p).trim() !== '') filled++;
    else empty++;
  }
  console.log(`Total rows: ${ws.rowCount - 1}, Filled: ${filled}, Empty: ${empty}`);
}

inspect20261014Rows().catch(console.error);
