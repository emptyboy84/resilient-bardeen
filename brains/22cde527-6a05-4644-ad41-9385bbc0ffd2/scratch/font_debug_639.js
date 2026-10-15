const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const basePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';
const outPath = path.join(SCRATCH, 'font_debug_639.xlsx');

const masterList = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'master_verified_194.json'), 'utf8'));
const item = masterList.find(x => x.rowNumber === 639);

console.log('Verified data for row 639:', JSON.stringify(item, null, 2));

async function test() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(basePath);
  const ws = wb.worksheets[0];

  // Only modify row 639 - set ALL 19 cols to black first, then red on new data
  const row = ws.getRow(639);
  
  // Print before state
  console.log('\n--- BEFORE modification ---');
  for (let c = 1; c <= 19; c++) {
    const cell = row.getCell(c);
    const argb = cell.font && cell.font.color && cell.font.color.argb;
    console.log(`  Col ${c}: value="${cell.value}" argb="${argb}"`);
  }

  // Reset ALL to black
  for (let c = 1; c <= 19; c++) {
    row.getCell(c).font = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: false };
  }

  // Now set specific cols to RED
  const redFont = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  
  // Col 4: bizno
  row.getCell(4).value = item.bizno;
  row.getCell(4).font = redFont;
  
  // Col 5: year
  if (item.year) {
    row.getCell(5).value = String(item.year);
    row.getCell(5).font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  }
  
  // Col 7: ceo
  if (item.ceo) {
    row.getCell(7).value = String(item.ceo);
    row.getCell(7).font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  }
  
  // Col 16: emp
  if (item.emp) {
    row.getCell(16).value = String(item.emp);
    row.getCell(16).font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  }
  
  // Col 19: source
  if (item.source) {
    row.getCell(19).value = String(item.source);
    row.getCell(19).font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  }
  
  // Print after state (in-memory)
  console.log('\n--- AFTER modification (in-memory) ---');
  for (let c = 1; c <= 19; c++) {
    const cell = row.getCell(c);
    const argb = cell.font && cell.font.color && cell.font.color.argb;
    console.log(`  Col ${c}: value="${cell.value}" argb="${argb}" bold=${cell.font && cell.font.bold}`);
  }

  // Also DON'T modify other rows at all - just save
  await wb.xlsx.writeFile(outPath);
  console.log('\nFile written.');

  // Re-read and verify
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(outPath);
  const ws2 = wb2.worksheets[0];
  const row2 = ws2.getRow(639);
  
  console.log('\n--- AFTER re-read from file ---');
  for (let c = 1; c <= 19; c++) {
    const cell = row2.getCell(c);
    const argb = cell.font && cell.font.color && cell.font.color.argb;
    console.log(`  Col ${c}: value="${cell.value}" argb="${argb}" bold=${cell.font && cell.font.bold}`);
  }
}

test().catch(console.error);
