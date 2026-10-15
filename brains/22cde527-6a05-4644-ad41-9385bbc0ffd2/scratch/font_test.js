const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');
const path = require('path');

const outFile = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/font_test.xlsx';

async function test() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Test');

  // Row 1: header
  ws.getCell('A1').value = 'Col1';
  ws.getCell('B1').value = 'Col2';
  ws.getCell('C1').value = 'Col3';

  // Row 2: Set A2 black, B2 red, C2 red
  const row2 = ws.getRow(2);
  
  // Method 1: Set value then font on cell object
  const a2 = row2.getCell(1);
  a2.value = 'Black';
  a2.font = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: false };

  const b2 = row2.getCell(2);
  b2.value = 'Red B2';
  b2.font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };

  const c2 = row2.getCell(3);
  c2.value = 'Red C2';
  c2.font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };

  // Row 3: Try with commit
  const row3 = ws.getRow(3);
  row3.getCell(1).value = 'Black R3';
  row3.getCell(1).font = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: false };
  row3.getCell(2).value = 'Red R3B';
  row3.getCell(2).font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  row3.getCell(3).value = 'Red R3C';
  row3.getCell(3).font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  row3.commit();

  // Row 4: Use ws.getCell directly
  ws.getCell('A4').value = 'Black A4';
  ws.getCell('A4').font = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: false };
  ws.getCell('B4').value = 'Red B4';
  ws.getCell('B4').font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  ws.getCell('C4').value = 'Red C4';
  ws.getCell('C4').font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };

  await wb.xlsx.writeFile(outFile);
  console.log('Written test file.');

  // Re-read and verify
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(outFile);
  const ws2 = wb2.worksheets[0];

  for (let r = 2; r <= 4; r++) {
    for (let c = 1; c <= 3; c++) {
      const cell = ws2.getRow(r).getCell(c);
      const argb = cell.font && cell.font.color && cell.font.color.argb;
      console.log(`Row ${r} Col ${c}: value="${cell.value}" font.color.argb="${argb}" bold=${cell.font && cell.font.bold}`);
    }
  }
}

test().catch(console.error);
