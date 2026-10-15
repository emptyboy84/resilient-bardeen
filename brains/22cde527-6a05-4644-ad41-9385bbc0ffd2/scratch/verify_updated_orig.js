const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function check() {
  const wb = new ExcelJS.Workbook();
  const p = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
  await wb.xlsx.readFile(p);
  const ws = wb.worksheets[0];
  console.log('Sheet name:', ws.name);
  console.log('Actual rowCount on read:', ws.rowCount);

  // Check row 2314
  const r2314 = ws.getRow(2314);
  console.log('Row 2314:', r2314.getCell(1).value, '|', r2314.getCell(2).value, '|', r2314.getCell(3).value, '|', r2314.getCell(4).value);

  // Check row 2315
  const r2315 = ws.getRow(2315);
  console.log('Row 2315:', r2315.getCell(1).value, '|', r2315.getCell(2).value, '|', r2315.getCell(3).value, '|', r2315.getCell(4).value);

  // Count red cells
  let redCount = 0;
  ws.eachRow((row, r) => {
    row.eachCell((cell, c) => {
      if (cell.font && cell.font.color && (cell.font.color.argb === 'FFFF0000' || cell.font.color.argb === 'FF0000')) {
        redCount++;
      }
    });
  });
  console.log('Total RED cells in verified file:', redCount);

  // Check sample rows:
  // Row 2 (아이티에프씨 - should be BLACK)
  console.log('\nRow 2 (original record, should be black):');
  ws.getRow(2).eachCell((cell, col) => {
    const isRed = cell.font && cell.font.color && (cell.font.color.argb === 'FFFF0000' || cell.font.color.argb === 'FF0000');
    console.log(`  Col ${col}: ${cell.value} ${isRed ? '[RED]' : '[BLACK]'}`);
  });

  // Row 639 (디자인에코 - should be RED for filled blanks)
  console.log('\nRow 639 (디자인에코, blanks filled in RED):');
  ws.getRow(639).eachCell((cell, col) => {
    const isRed = cell.font && cell.font.color && (cell.font.color.argb === 'FFFF0000' || cell.font.color.argb === 'FF0000');
    console.log(`  Col ${col}: ${cell.value} ${isRed ? '[RED]' : '[BLACK]'}`);
  });
}

check();
