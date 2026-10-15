const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function check() {
  const wb = new ExcelJS.Workbook();
  const p = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';
  await wb.xlsx.readFile(p);
  const ws = wb.worksheets[0];
  console.log('Sheet name:', ws.name);
  console.log('Row count:', ws.rowCount);
  console.log('Header row 1:');
  const headers = [];
  ws.getRow(1).eachCell({ includeEmpty: true }, (c, i) => headers.push(`Col ${i}: ${c.value}`));
  console.log(headers);

  // Check row 639 (디자인에코)
  const r639 = [];
  ws.getRow(639).eachCell({ includeEmpty: true }, (c, i) => r639.push(`Col ${i}: ${c.value}`));
  console.log('Row 639 in !! file:');
  console.log(r639);
}

check();
