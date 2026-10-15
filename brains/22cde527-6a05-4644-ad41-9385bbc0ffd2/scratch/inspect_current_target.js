const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function check() {
  const wb = new ExcelJS.Workbook();
  const p = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
  await wb.xlsx.readFile(p);
  const ws = wb.worksheets[0];
  console.log('Sheet name:', ws.name);
  console.log('Row count:', ws.rowCount);
  
  // Count red cells
  let redCellsCount = 0;
  let sampleRed = [];
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      if (cell.font && cell.font.color && (cell.font.color.argb === 'FFFF0000' || cell.font.color.argb === 'FF0000')) {
        redCellsCount++;
        if (sampleRed.length < 5) {
          sampleRed.push({ row: rowNumber, col: colNumber, val: cell.value, font: cell.font });
        }
      }
    });
  });

  console.log('Total RED cells in current original file:', redCellsCount);
  console.log('Sample red cells:', sampleRed);

  // Check row 639 in original file
  const r639 = [];
  ws.getRow(639).eachCell({ includeEmpty: true }, (c, i) => {
    r639.push({ col: i, val: c.value, font: c.font });
  });
  console.log('\nRow 639 in current original file:');
  console.log(r639);
}

check();
