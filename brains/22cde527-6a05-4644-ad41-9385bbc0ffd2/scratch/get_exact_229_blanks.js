const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const xlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx';

async function run() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.worksheets[0];
  
  const blanks = [];
  for (let r = 2; r <= 2314; r++) {
    const row = ws.getRow(r);
    const name = row.getCell(3).value ? String(row.getCell(3).value).trim() : '';
    if (!name) continue;
    
    const bizno = row.getCell(4).value;
    if (!bizno || String(bizno).trim() === '') {
      blanks.push({
        rowNumber: r,
        seq: row.getCell(2).value,
        gubun: row.getCell(1).value,
        name: name,
        year: row.getCell(5).value ? String(row.getCell(5).value).trim() : '',
        month: row.getCell(6).value ? String(row.getCell(6).value).trim() : '',
        ceo: row.getCell(7).value ? String(row.getCell(7).value).trim() : '',
        phone: row.getCell(8).value ? String(row.getCell(8).value).trim() : '',
        fax: row.getCell(9).value ? String(row.getCell(9).value).trim() : '',
        gu: row.getCell(10).value ? String(row.getCell(10).value).trim() : '',
        address: row.getCell(11).value ? String(row.getCell(11).value).trim() : '',
        category: row.getCell(12).value ? String(row.getCell(12).value).trim() : ''
      });
    }
  }
  
  console.log(`Exact genuine blank companies count: ${blanks.length}`);
  fs.writeFileSync(path.join(SCRATCH_DIR, 'exact_blanks_229.json'), JSON.stringify(blanks, null, 2), 'utf8');
}
run();
