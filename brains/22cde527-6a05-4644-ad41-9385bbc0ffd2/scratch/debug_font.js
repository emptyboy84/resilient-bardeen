const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function debug() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx');
  const ws = wb.worksheets[0];
  const row = ws.getRow(639);

  const redBoldFont = {
    name: '맑은 고딕',
    size: 10,
    color: { argb: 'FFFF0000' },
    bold: true
  };

  const c4 = row.getCell(4);
  c4.value = '603-10-85753';
  c4.font = redBoldFont;

  const c5 = row.getCell(5);
  console.log('Original c5:', c5.value, c5.font);
  c5.value = '2009';
  c5.font = redBoldFont;
  console.log('After setting c5:', c5.value, c5.font);

  await wb.xlsx.writeFile('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/debug_out.xlsx');

  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/debug_out.xlsx');
  const ws2 = wb2.worksheets[0];
  const r2 = ws2.getRow(639);
  console.log('Re-read c4:', r2.getCell(4).value, r2.getCell(4).font);
  console.log('Re-read c5:', r2.getCell(5).value, r2.getCell(5).font);
}

debug();
