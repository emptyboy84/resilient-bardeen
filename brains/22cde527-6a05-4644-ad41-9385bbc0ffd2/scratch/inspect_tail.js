const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function test() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx');
  const ws = wb.worksheets[0];
  console.log('ws.rowCount:', ws.rowCount);
  for (let r = 2305; r <= 2320; r++) {
    const row = ws.getRow(r);
    console.log('Row ' + r + ':', row.getCell(1).value, '|', row.getCell(2).value, '|', row.getCell(3).value, '|', row.getCell(4).value);
  }
  console.log('--- Last rows ---');
  for (let r = 2460; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    console.log('Row ' + r + ':', row.getCell(1).value, '|', row.getCell(2).value, '|', row.getCell(3).value, '|', row.getCell(4).value);
  }
}
test();
