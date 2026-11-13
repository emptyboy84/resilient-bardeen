const ExcelJS = require('exceljs');

async function checkRow1106() {
  const filePath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  const row = ws.getRow(1107);
  console.log('Row 1107 (Seq 1106) values:');
  for (let c = 1; c <= 17; c++) {
    const cell = row.getCell(c);
    console.log(`Col ${c}: ${cell.value}`);
  }
}

checkRow1106().catch(console.error);
