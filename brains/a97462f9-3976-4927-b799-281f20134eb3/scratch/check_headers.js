const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function checkHeaders() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('./data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
  const sheet = workbook.getWorksheet('기업 정보');
  const row1 = sheet.getRow(1).values;
  const row2 = sheet.getRow(2).values;
  console.log('Row 1 (Headers):');
  row1.forEach((val, colIdx) => {
    if (val !== undefined && val !== null) {
      console.log(`Col ${colIdx}: ${val}`);
    }
  });
}

checkHeaders().catch(console.error);
