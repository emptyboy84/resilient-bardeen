const ExcelJS = require('exceljs');
const wb = new ExcelJS.Workbook();
const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';

async function checkRows() {
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  for (let r = 1129; r <= 1134; r++) {
    const row = ws.getRow(r);
    console.log(`Row ${r} (연번 ${row.getCell(1).value}): ${row.getCell(2).value} | 대표: ${row.getCell(3).value} | Col 10: ${row.getCell(10).value}`);
  }
}
checkRows();
