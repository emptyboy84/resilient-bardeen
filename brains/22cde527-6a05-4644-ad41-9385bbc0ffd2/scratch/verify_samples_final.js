const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

async function test() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx');
  const ws = wb.worksheets[0];
  console.log('Total rows in sheet:', ws.rowCount);
  console.log('Header col 2:', ws.getRow(1).getCell(2).value);
  console.log('Header col 19:', ws.getRow(1).getCell(19).value);
  
  const sampleRows = [639, 1285, 2165, 2263, 2307];
  for (const r of sampleRows) {
    const row = ws.getRow(r);
    console.log('--- Row ' + r + ': [' + row.getCell(3).value + '] ---');
    console.log('기존행번호:', row.getCell(2).value);
    console.log('사업자번호:', row.getCell(4).value, '(Red:', row.getCell(4).font?.color?.argb === 'FFFF0000', ')');
    console.log('설립연도:', row.getCell(5).value + '년 ' + row.getCell(6).value + '월');
    console.log('대표자:', row.getCell(7).value);
    console.log('연락처:', row.getCell(8).value);
    console.log('팩스:', row.getCell(9).value);
    console.log('종사자수:', row.getCell(16).value);
    console.log('24년 매출액:', row.getCell(17).value);
    console.log('출처:', row.getCell(19).value);
  }
}
test();
