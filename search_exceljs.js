const ExcelJS = require('exceljs');

async function searchOrig() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달 (1).xlsx');
  const ws = wb.worksheets[0];
  console.log('Total rows:', ws.rowCount);
  ws.eachRow((row, rowNumber) => {
    const text = row.values.join(' | ');
    if (text.includes('923-0405') || text.includes('9230405') || text.includes('0405')) {
      console.log('Row ' + rowNumber + ':', text);
    }
  });
}
searchOrig();
