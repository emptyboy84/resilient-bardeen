const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const files = [
  { label: '크레탑!!', path: 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx' },
  { label: '크레탑_automation', path: 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_automation.xlsx' },
  { label: '크레탑_crawling', path: 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_crawling.xlsx' },
  { label: '크레탑_최종', path: 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx' },
];

async function check() {
  for (const f of files) {
    try {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(f.path);
      const ws = wb.worksheets[0];

      let totalRed = 0;
      let totalCells = 0;
      let redInRow639 = [];

      for (let r = 2; r <= Math.min(ws.rowCount, 2314); r++) {
        const row = ws.getRow(r);
        for (let c = 1; c <= 19; c++) {
          const cell = row.getCell(c);
          totalCells++;
          const argb = cell.font && cell.font.color && cell.font.color.argb;
          if (argb && argb.toUpperCase() === 'FFFF0000') {
            totalRed++;
            if (r === 639) redInRow639.push(c);
          }
        }
      }

      // Check row 639 bizno
      const bizno639 = ws.getRow(639).getCell(4).value;

      console.log(`\n[${f.label}]`);
      console.log(`  Rows: ${ws.rowCount}, Total cells checked: ${totalCells}`);
      console.log(`  Total RED cells: ${totalRed}`);
      console.log(`  Row 639 Col 4 (bizno): "${bizno639}"`);
      console.log(`  Row 639 red cols: ${redInRow639.join(',') || 'none'}`);
    } catch (e) {
      console.log(`\n[${f.label}] ERROR: ${e.message}`);
    }
  }
}

check().catch(console.error);
