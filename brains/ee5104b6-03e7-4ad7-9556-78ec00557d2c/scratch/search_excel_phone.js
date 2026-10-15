const ExcelJS = require('c:/Users/lg/resilient-bardeen/node_modules/exceljs');
const path = require('path');

async function searchFile(filePath) {
  console.log('Searching in:', filePath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  wb.eachSheet((sheet, sheetId) => {
    sheet.eachRow((row, rowNumber) => {
      const values = row.values;
      const str = JSON.stringify(values);
      if (str.includes('276-9823') || str.includes('2769823')) {
        console.log(`Sheet: ${sheet.name}, Row ${rowNumber}: ${str}`);
      }
    });
  });
}

async function main() {
  await searchFile('c:/Users/lg/resilient-bardeen/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
  await searchFile('c:/Users/lg/resilient-bardeen/data/배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx');
}
main().catch(console.error);
