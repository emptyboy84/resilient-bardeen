const ExcelJS = require('exceljs');
const wb = new ExcelJS.Workbook();
const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';

async function checkRow() {
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  const row = ws.getRow(1165);
  for (let c = 1; c <= 17; c++) {
    console.log(`Col ${c}:`, row.getCell(c).value);
  }
}
checkRow();
