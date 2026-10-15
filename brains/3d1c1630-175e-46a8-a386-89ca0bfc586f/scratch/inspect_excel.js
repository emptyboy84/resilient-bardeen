const ExcelJS = require('exceljs');

async function inspect() {
  const wb = new ExcelJS.Workbook();
  const filePath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  console.log('Loading workbook:', filePath);
  await wb.xlsx.readFile(filePath);
  console.log('Workbook loaded. Sheet count:', wb.worksheets.length);
  wb.worksheets.forEach((ws, idx) => {
    console.log(`Sheet ${idx + 1}: "${ws.name}", rowCount: ${ws.rowCount}, colCount: ${ws.columnCount}`);
  });
}

inspect().catch(err => console.error(err));
