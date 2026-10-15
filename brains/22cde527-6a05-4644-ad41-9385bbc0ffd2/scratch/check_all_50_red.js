const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const targetXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';

async function checkRed() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetXlsxPath);
  const ws = wb.worksheets[0];

  const list = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const cell17 = row.getCell(17);
    const argb = cell17.font && cell17.font.color && cell17.font.color.argb;
    if (argb && argb.toUpperCase() === 'FFFF0000') {
      list.push({
        row: r,
        name: row.getCell(3).value,
        bizno: row.getCell(4).value,
        sales: cell17.value
      });
    }
  }

  console.log(`Found ${list.length} RED revenue cells:`);
  list.forEach((x, i) => console.log(`${i + 1}. [행 ${x.row}] ${x.name} (${x.bizno}) : ${x.sales}원`));
}

checkRed().catch(console.error);
