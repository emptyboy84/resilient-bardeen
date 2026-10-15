const ExcelJS = require('exceljs');

async function checkWorkbook(filepath) {
  console.log('Reading:', filepath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filepath);
  wb.eachSheet((sheet) => {
    console.log(`Sheet: ${sheet.name}, rowCount: ${sheet.rowCount}, colCount: ${sheet.columnCount}`);
    const r1 = sheet.getRow(1).values;
    const r2 = sheet.getRow(2).values;
    console.log('Row 1:', JSON.stringify(r1).slice(0, 300));
    console.log('Row 2:', JSON.stringify(r2).slice(0, 300));
  });
}

async function main() {
  await checkWorkbook('data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
  await checkWorkbook('data/배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx');
}

main().catch(console.error);
