const ExcelJS = require('exceljs');

async function checkRows() {
  const file = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  const ws = wb.worksheets[0];

  for (let r = 1827; r <= 1838; r++) {
    const row = ws.getRow(r);
    console.log(
      'Row ' + r + ': ' +
      'Seq=' + row.getCell(1).value + ', ' +
      'Name=' + row.getCell(2).value + ', ' +
      'CEO=' + row.getCell(3).value + ', ' +
      'Status=' + row.getCell(4).value + ', ' +
      'BNO=' + row.getCell(6).value + ', ' +
      'Phone=' + row.getCell(10).value
    );
  }
}
checkRows();
