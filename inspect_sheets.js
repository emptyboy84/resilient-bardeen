const ExcelJS = require('exceljs');
const fs = require('fs');

const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx';

async function checkSheets() {
  const tempPath = 'temp_sheets.xlsx';
  fs.copyFileSync(filePath, tempPath);
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  
  console.log('Sheet names:', wb.worksheets.map(w => w.name));
  
  wb.worksheets.forEach((ws, sIdx) => {
    console.log(`\n=== SHEET ${sIdx}: ${ws.name} ===`);
    const r1 = ws.getRow(1);
    const headers = [];
    r1.eachCell({ includeEmpty: true }, (c, col) => {
      headers.push(`C${col}: ${c.value}`);
    });
    console.log('Row 1 Headers:\n', headers.join(' | '));
    
    // Sample Row 2
    const r2 = ws.getRow(2);
    const sample = [];
    r2.eachCell({ includeEmpty: true }, (c, col) => {
      sample.push(`C${col}: ${c.value}`);
    });
    console.log('Row 2 Sample:\n', sample.join(' | '));
  });

  fs.unlinkSync(tempPath);
}
checkSheets().catch(e => console.error(e));
