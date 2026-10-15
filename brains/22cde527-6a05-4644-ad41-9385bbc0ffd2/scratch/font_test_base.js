const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const basePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';
const outPath = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/font_test_from_base.xlsx';

async function test() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(basePath);
  const ws = wb.worksheets[0];
  console.log('Sheet name:', ws.name);
  console.log('Row count:', ws.rowCount);

  // Check current font on row 639 col 4 before modification
  const origCell = ws.getRow(639).getCell(4);
  console.log('Before mod - Row 639 Col 4: value=', origCell.value, 'font=', JSON.stringify(origCell.font));

  // Now set row 639 cells 4,5,6,7 to red bold
  const testRow = ws.getRow(639);
  for (const c of [4, 5, 6, 7]) {
    const cell = testRow.getCell(c);
    cell.value = 'TEST_RED_' + c;
    cell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  }

  // Also test: set row 640 cells using ws.getCell directly
  for (const c of [4, 5, 6, 7]) {
    const cellRef = String.fromCharCode(64 + c) + '640';
    const cell = ws.getCell(cellRef);
    cell.value = 'TEST_RED_DIRECT_' + c;
    cell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  }

  // Row 641: set with style property
  for (const c of [4, 5, 6, 7]) {
    const cell = ws.getRow(641).getCell(c);
    cell.value = 'TEST_STYLE_' + c;
    cell.style = {
      font: { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true }
    };
  }

  await wb.xlsx.writeFile(outPath);
  console.log('Written test file.');

  // Re-read and verify
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(outPath);
  const ws2 = wb2.worksheets[0];

  for (const r of [639, 640, 641]) {
    for (const c of [4, 5, 6, 7]) {
      const cell = ws2.getRow(r).getCell(c);
      const argb = cell.font && cell.font.color && cell.font.color.argb;
      const theme = cell.font && cell.font.color && cell.font.color.theme;
      console.log(`Row ${r} Col ${c}: value="${cell.value}" argb="${argb}" theme="${theme}" bold=${cell.font && cell.font.bold}`);
    }
  }
}

test().catch(console.error);
