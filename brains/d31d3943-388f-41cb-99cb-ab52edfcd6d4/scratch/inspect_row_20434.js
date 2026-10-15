const ExcelJS = require('exceljs');
const path = require('path');

async function inspectRow() {
  const filePath = path.resolve('data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
  const options = { sharedStrings: 'cache', hyperlinks: 'ignore', worksheets: 'emit' };
  const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(filePath, options);
  let headers = [];
  for await (const worksheetReader of workbookReader) {
    let rowNum = 0;
    for await (const row of worksheetReader) {
      rowNum++;
      if (rowNum === 1) {
        headers = row.values;
      }
      if (rowNum === 20434) {
        console.log('Row 20434 details:');
        const vals = row.values;
        headers.forEach((h, idx) => {
          if (idx > 0) {
            console.log(`[${idx}] ${h}: ${vals[idx]}`);
          }
        });
        break;
      }
    }
    break;
  }
}
inspectRow().catch(console.error);
