const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function test() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/인공지능으로찾은거.xlsx');
  console.log('Worksheets:');
  for (let i = 0; i < wb.worksheets.length; i++) {
    const ws = wb.worksheets[i];
    console.log(`  Sheet ${i + 1}: "${ws.name}" (${ws.rowCount} rows)`);
  }

  const ws1 = wb.worksheets[0];
  const r639 = ws1.getRow(639);
  console.log('\n--- Row 639 (디자인에코) in Sheet 1 ---');
  console.log('  Col 3 (사업체명):', r639.getCell(3).value);
  console.log('  Col 4 (사업자번호):', r639.getCell(4).value, 'Color:', r639.getCell(4).font && r639.getCell(4).font.color && r639.getCell(4).font.color.argb);
  console.log('  Col 5 (설립연도):', r639.getCell(5).value, 'Color:', r639.getCell(5).font && r639.getCell(5).font.color && r639.getCell(5).font.color.argb);
  console.log('  Col 16 (종사자수):', r639.getCell(16).value, 'Color:', r639.getCell(16).font && r639.getCell(16).font.color && r639.getCell(16).font.color.argb);

  const r703 = ws1.getRow(703);
  console.log('\n--- Row 703 (브이드림) in Sheet 1 ---');
  console.log('  Col 4 (사업자번호):', r703.getCell(4).value);
  console.log('  Col 17 (24년 매출액):', r703.getCell(17).value, 'Color:', r703.getCell(17).font && r703.getCell(17).font.color && r703.getCell(17).font.color.argb);

  const ws2 = wb.worksheets[1];
  console.log('\n--- Sheet 2 Sample (Row 2) ---');
  const r2 = ws2.getRow(2);
  console.log('  기존행번호:', r2.getCell(2).value);
  console.log('  사업체명:', r2.getCell(3).value);
  console.log('  사업자번호:', r2.getCell(4).value, 'Color:', r2.getCell(4).font && r2.getCell(4).font.color && r2.getCell(4).font.color.argb);
}

test().catch(console.error);
