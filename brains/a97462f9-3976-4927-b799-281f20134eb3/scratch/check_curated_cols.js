const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function checkCuratedCols() {
  const blueReportPath = 'C:/Users/lg/Desktop/Today/CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(blueReportPath);
  const ws = wb.worksheets[0];

  console.log(`Sheet Name: ${ws.name}`);
  for (let r = 1; r <= 5; r++) {
    const row = ws.getRow(r);
    console.log(`Row ${r}:`, row.values);
  }
}

checkCuratedCols().catch(console.error);
