const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const targetXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';

async function verify() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetXlsxPath);
  const ws = wb.worksheets[0];

  let revCount = 0;
  let redRevCount = 0;
  const samples = [];

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const cell17 = row.getCell(17);
    if (cell17.value && String(cell17.value).trim() !== '') {
      revCount++;
      const argb = cell17.font && cell17.font.color && cell17.font.color.argb;
      const isRed = argb && argb.toUpperCase() === 'FFFF0000';
      if (isRed) redRevCount++;

      if (samples.length < 10) {
        samples.push({
          row: r,
          name: row.getCell(3).value,
          bizno: row.getCell(4).value,
          revenue: cell17.value,
          isRed
        });
      }
    }
  }

  console.log(`Total rows with revenue in Col 17: ${revCount}`);
  console.log(`Total revenue cells in RED: ${redRevCount}`);
  console.log('\nSample verified revenue rows:');
  console.table(samples);
}

verify().catch(console.error);
