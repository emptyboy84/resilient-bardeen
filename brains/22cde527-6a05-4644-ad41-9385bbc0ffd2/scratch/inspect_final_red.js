const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function check() {
  const wb = new ExcelJS.Workbook();
  const p = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx';
  await wb.xlsx.readFile(p);
  const ws = wb.worksheets[0];
  console.log('Sheet name:', ws.name);
  console.log('Row count:', ws.rowCount);
  
  let redCellsCount = 0;
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      if (cell.font && cell.font.color && (cell.font.color.argb === 'FFFF0000' || cell.font.color.argb === 'FF0000')) {
        redCellsCount++;
      }
    });
  });

  console.log('Total RED cells in _최종.xlsx:', redCellsCount);
}

check();
