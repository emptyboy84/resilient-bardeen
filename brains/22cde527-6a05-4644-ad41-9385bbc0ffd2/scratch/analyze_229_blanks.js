const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const targetXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';

async function analyzeBlanks() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetXlsxPath);
  const ws = wb.worksheets[0];

  const blanks = [];
  const categoryCount = {};
  let withCeo = 0;
  let withTel = 0;
  let withAddr = 0;

  for (let r = 2; r <= 2314; r++) {
    const row = ws.getRow(r);
    const bizno = row.getCell(4).value ? String(row.getCell(4).value).trim() : '';

    if (!bizno) {
      const name = row.getCell(3).value ? String(row.getCell(3).value).trim() : '';
      const ceo = row.getCell(7).value ? String(row.getCell(7).value).trim() : '';
      const tel = row.getCell(8).value ? String(row.getCell(8).value).trim() : '';
      const addr = row.getCell(11).value ? String(row.getCell(11).value).trim() : '';
      const cat = row.getCell(12).value ? String(row.getCell(12).value).trim() : '미분류';

      if (ceo) withCeo++;
      if (tel) withTel++;
      if (addr) withAddr++;

      categoryCount[cat] = (categoryCount[cat] || 0) + 1;

      blanks.push({
        row: r,
        origRow: row.getCell(2).value,
        name,
        ceo,
        tel,
        addr,
        category: cat
      });
    }
  }

  console.log(`Total Blank Rows: ${blanks.length}`);
  console.log(`- With CEO: ${withCeo}`);
  console.log(`- With Telephone: ${withTel}`);
  console.log(`- With Address: ${withAddr}`);
  console.log('\nCategory breakdown:');
  console.table(categoryCount);

  // Save to scratch
  fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/remaining_229_blanks.json', JSON.stringify(blanks, null, 2), 'utf8');
  console.log('Saved to remaining_229_blanks.json');
}

analyzeBlanks().catch(console.error);
