const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function checkFile(p) {
  console.log(`\n=== Checking: ${p} ===`);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(p);
  const ws = wb.worksheets[0];
  console.log('Sheet name:', ws.name, 'Rows:', ws.rowCount);
  
  let redCount = 0;
  ws.eachRow((row, r) => {
    row.eachCell((c) => {
      if (c.font && c.font.color && (c.font.color.argb === 'FFFF0000' || c.font.color.argb === 'FF0000')) {
        redCount++;
      }
    });
  });
  console.log('Red cells count:', redCount);

  // Check row 2
  const r2 = [];
  ws.getRow(2).eachCell({ includeEmpty: true }, (c, i) => r2.push(`Col ${i}: ${c.value} (${c.font?.color?.argb || 'BLACK'})`));
  console.log('Row 2:', r2.slice(0, 7));

  // Check row 639
  const r639 = [];
  ws.getRow(639).eachCell({ includeEmpty: true }, (c, i) => r639.push(`Col ${i}: ${c.value} (${c.font?.color?.argb || 'BLACK'})`));
  console.log('Row 639:', r639.slice(0, 8));
}

async function run() {
  await checkFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_automation.xlsx');
  await checkFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx');
}

run();
