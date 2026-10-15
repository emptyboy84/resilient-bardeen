const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_goejeong_manhwa_data/node_modules/exceljs');

async function findBaeRows() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
  const sheet = wb.getWorksheet('기업 정보');
  let minRow = Infinity;
  let maxRow = -Infinity;
  let count = 0;
  
  sheet.eachRow((row, rowNumber) => {
    const author = row.getCell(2).value;
    if (author === '배현명') {
      count++;
      if (rowNumber < minRow) minRow = rowNumber;
      if (rowNumber > maxRow) maxRow = rowNumber;
    }
  });
  console.log(`배현명 rows: count=${count}, minRow=${minRow}, maxRow=${maxRow}`);
}

findBaeRows().catch(console.error);
