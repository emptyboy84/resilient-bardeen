const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function check() {
  const wb = new ExcelJS.Workbook();
  const p = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
  await wb.xlsx.readFile(p);
  const ws = wb.worksheets[0];
  
  for (let r = 2; r <= 6; r++) {
    const row = ws.getRow(r);
    console.log(`\nRow ${r}:`);
    row.eachCell({ includeEmpty: false }, (c, col) => {
      const isRed = c.font && c.font.color && (c.font.color.argb === 'FFFF0000' || c.font.color.argb === 'FF0000');
      console.log(`  Col ${col} [${ws.getRow(1).getCell(col).value}]: ${c.value} ${isRed ? '(RED)' : '(BLACK)'}`);
    });
  }
}

check();
