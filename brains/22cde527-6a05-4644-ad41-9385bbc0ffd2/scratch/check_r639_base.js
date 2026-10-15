const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function check() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx');
  const ws = wb.worksheets[0];
  const row = ws.getRow(639);
  for (let c = 1; c <= 19; c++) {
    const cell = row.getCell(c);
    console.log(`Col ${c}: val=${JSON.stringify(cell.value)}, fontColor=${cell.font?.color?.argb}`);
  }
}
check();
