const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function verify() {
  const wb = new ExcelJS.Workbook();
  const p = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
  await wb.xlsx.readFile(p);
  const ws = wb.worksheets[0];

  console.log('Sheet Name:', ws.name);
  console.log('Total Rows:', ws.rowCount);

  // Check headers
  console.log('\n--- HEADERS ---');
  for (let c = 1; c <= 19; c++) {
    const cell = ws.getRow(1).getCell(c);
    console.log(`Col ${c}: ${cell.value} (Font: ${cell.font?.name}, Bold: ${cell.font?.bold}, Color: ${cell.font?.color?.argb})`);
  }

  // Check Row 2 (original record)
  console.log('\n--- ROW 2 (Original Existing Company - Should be ALL BLACK) ---');
  ws.getRow(2).eachCell((cell, col) => {
    const isRed = cell.font?.color?.argb === 'FFFF0000';
    console.log(`Col ${col} [${ws.getRow(1).getCell(col).value}]: "${cell.value}" => ${isRed ? 'RED BOLD' : 'BLACK'}`);
  });

  // Check Row 639 (디자인에코)
  console.log('\n--- ROW 639 (디자인에코 - Only Filled Blanks Should be RED BOLD) ---');
  ws.getRow(639).eachCell((cell, col) => {
    const isRed = cell.font?.color?.argb === 'FFFF0000';
    console.log(`Col ${col} [${ws.getRow(1).getCell(col).value}]: "${cell.value}" => ${isRed ? 'RED BOLD' : 'BLACK'}`);
  });

  // Check Row 2307 (피커스튜디오)
  console.log('\n--- ROW 2307 (피커스튜디오 - 매출액 1,920,000원 확인) ---');
  ws.getRow(2307).eachCell((cell, col) => {
    const isRed = cell.font?.color?.argb === 'FFFF0000';
    console.log(`Col ${col} [${ws.getRow(1).getCell(col).value}]: "${cell.value}" => ${isRed ? 'RED BOLD' : 'BLACK'}`);
  });

  // Check Row 2314 & 2315
  console.log('\n--- BOUNDARY CHECK (2314 and 2315) ---');
  const r2314 = ws.getRow(2314);
  console.log('Row 2314 Col 3:', r2314.getCell(3).value, 'Col 4:', r2314.getCell(4).value);
  const r2315 = ws.getRow(2315);
  console.log('Row 2315 has values?:', r2315.getCell(3).value ? 'YES' : 'NO (Empty)');

  // Count total red cells across the whole sheet
  let totalRed = 0;
  ws.eachRow((row, r) => {
    if (r === 1) return;
    row.eachCell((cell) => {
      if (cell.font?.color?.argb === 'FFFF0000') totalRed++;
    });
  });
  console.log('\n>>> TOTAL RED BOLD CELLS IN WHOLE WORKBOOK:', totalRed, '<<<');
}

verify().catch(console.error);
