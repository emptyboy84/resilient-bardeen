const ExcelJS = require('exceljs');
const path = require('path');

async function searchExcel() {
  const filePath = path.resolve('data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
  const options = {
    sharedStrings: 'cache',
    hyperlinks: 'ignore',
    worksheets: 'emit'
  };
  const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(filePath, options);
  
  for await (const worksheetReader of workbookReader) {
    console.log('Scanning worksheet:', worksheetReader.name);
    let rowNum = 0;
    for await (const row of worksheetReader) {
      rowNum++;
      const values = row.values;
      if (!values) continue;
      const str = JSON.stringify(values);
      if (str.includes('에코캡') || str.includes('9508184196') || str.includes('6058184196') || str.includes('센텀북대로 60')) {
        console.log(`Match at row ${rowNum}: ${str}`);
      }
    }
  }
}

searchExcel().catch(console.error);
