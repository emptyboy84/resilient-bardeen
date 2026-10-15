process.env.NODE_PATH = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules';
require('module').Module._initPaths();
const fs = require('fs');
const ExcelJS = require('exceljs');

async function extract271() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx');
  const ws = wb.getWorksheet(1);
  
  const unpopulated = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const bizno = row.getCell(4).value;
    if (!bizno || String(bizno).trim() === '') {
      unpopulated.push({
        rowNumber: r,
        seq: row.getCell(2).value,
        gubun: row.getCell(1).value,
        name: row.getCell(3).value ? String(row.getCell(3).value).trim() : '',
        ceo: row.getCell(7).value ? String(row.getCell(7).value).trim() : '',
        phone: row.getCell(8).value ? String(row.getCell(8).value).trim() : '',
        fax: row.getCell(9).value ? String(row.getCell(9).value).trim() : '',
        gu: row.getCell(10).value ? String(row.getCell(10).value).trim() : '',
        address: row.getCell(11).value ? String(row.getCell(11).value).trim() : '',
        category: row.getCell(12).value ? String(row.getCell(12).value).trim() : ''
      });
    }
  }
  
  fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/unpopulated_271.json', JSON.stringify(unpopulated, null, 2), 'utf8');
  console.log('Saved 271 unpopulated rows to unpopulated_271.json. Count:', unpopulated.length);
  
  let withCeo = unpopulated.filter(x => x.ceo).length;
  let withAddr = unpopulated.filter(x => x.address).length;
  let withPhone = unpopulated.filter(x => x.phone).length;
  console.log(`With CEO: ${withCeo}, With Addr: ${withAddr}, With Phone: ${withPhone}`);
}

extract271();
