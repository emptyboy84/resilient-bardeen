const ExcelJS = require('exceljs');

async function checkRow1000() {
  const filePath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  const row = ws.getRow(1001);
  console.log('Row 1001 (Seq 1000) values:');
  for (let c = 1; c <= 17; c++) {
    const cell = row.getCell(c);
    console.log(`Col ${c}: ${cell.value}`);
  }
}

checkRow1000().catch(console.error);
