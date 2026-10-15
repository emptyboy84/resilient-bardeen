const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterList = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'master_verified_194.json'), 'utf8'));
const masterMap = {};
for (const item of masterList) {
  masterMap[item.rowNumber] = item;
}

async function trace() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx');
  const ws = wb.worksheets[0];

  const row = ws.getRow(639);
  const verified = masterMap[639];
  console.log('verified:', verified);

  function fillBlankRed(colIdx, val) {
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      const cell = row.getCell(colIdx);
      cell.value = String(val).trim();
      cell.font = {
        name: '맑은 고딕',
        size: 10,
        color: { argb: 'FFFF0000' },
        bold: true
      };
      console.log(`Setting Col ${colIdx} = ${val} font =`, cell.font);
    }
  }

  fillBlankRed(4, verified.bizno);
  if (verified.year) fillBlankRed(5, verified.year);
  if (verified.month) fillBlankRed(6, verified.month);
  if (verified.ceo) fillBlankRed(7, verified.ceo);
  if (verified.tel) fillBlankRed(8, verified.tel);
  if (verified.fax) fillBlankRed(9, verified.fax);
  if (verified.emp) fillBlankRed(16, verified.emp);
  if (verified.source) fillBlankRed(19, verified.source);

  console.log('\nRow 639 before write:');
  for (let c = 1; c <= 19; c++) {
    const cell = row.getCell(c);
    console.log(`Col ${c}: ${cell.value} (${cell.font?.color?.argb})`);
  }

  await wb.xlsx.writeFile('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/trace_r639.xlsx');

  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/trace_r639.xlsx');
  const ws2 = wb2.worksheets[0];
  const r2 = ws2.getRow(639);
  console.log('\nRow 639 after re-read:');
  for (let c = 1; c <= 19; c++) {
    const cell = r2.getCell(c);
    console.log(`Col ${c}: ${cell.value} (${cell.font?.color?.argb})`);
  }
}

trace();
