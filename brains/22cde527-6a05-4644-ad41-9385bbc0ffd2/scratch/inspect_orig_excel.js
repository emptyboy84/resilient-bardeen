const ExcelJS = require('exceljs');

async function inspect() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx');
  
  console.log('Sheet names:', wb.worksheets.map(s => s.name));
  const ws = wb.worksheets[0];
  console.log('Row count:', ws.rowCount, 'Column count:', ws.columnCount);
  
  const headers = [];
  ws.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    headers.push({ col: colNumber, val: cell.value });
  });
  console.log('Headers in Row 1:');
  console.log(headers);

  console.log('\nRow 2 sample:');
  const r2 = [];
  ws.getRow(2).eachCell({ includeEmpty: true }, (cell, colNumber) => {
    r2.push({ col: colNumber, val: cell.value, font: cell.font });
  });
  console.log(r2.slice(0, 10));
}

inspect();
