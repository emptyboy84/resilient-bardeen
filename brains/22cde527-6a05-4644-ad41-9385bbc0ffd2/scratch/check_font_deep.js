const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const basePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';
const outputPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';

async function check() {
  const wbBase = new ExcelJS.Workbook();
  await wbBase.xlsx.readFile(basePath);
  const wsBase = wbBase.worksheets[0];

  const wbOut = new ExcelJS.Workbook();
  await wbOut.xlsx.readFile(outputPath);
  const wsOut = wbOut.worksheets[0];

  // Check row 2 (non-verified row) - full font details
  console.log('=== BASE: Row 2 (non-verified) font details ===');
  for (let c = 1; c <= 5; c++) {
    const cell = wsBase.getRow(2).getCell(c);
    console.log(`  Col ${c}: value="${cell.value}" font=`, JSON.stringify(cell.font));
  }

  console.log('\n=== OUTPUT: Row 2 (non-verified) font details ===');
  for (let c = 1; c <= 5; c++) {
    const cell = wsOut.getRow(2).getCell(c);
    console.log(`  Col ${c}: value="${cell.value}" font=`, JSON.stringify(cell.font));
  }

  // Check row 100 (should be non-verified)
  console.log('\n=== BASE: Row 100 font details ===');
  for (let c = 1; c <= 5; c++) {
    const cell = wsBase.getRow(100).getCell(c);
    console.log(`  Col ${c}: value="${cell.value}" font=`, JSON.stringify(cell.font));
  }

  console.log('\n=== OUTPUT: Row 100 font details ===');
  for (let c = 1; c <= 5; c++) {
    const cell = wsOut.getRow(100).getCell(c);
    console.log(`  Col ${c}: value="${cell.value}" font=`, JSON.stringify(cell.font));
  }

  // Check if base row 2 has theme color
  console.log('\n=== BASE: Row 2 Col 1 full style ===');
  const c21 = wsBase.getRow(2).getCell(1);
  console.log('  style:', JSON.stringify(c21.style));
}

check().catch(console.error);
