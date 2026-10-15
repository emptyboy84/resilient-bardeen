const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function dumpExactRows() {
  const blueReportPath = 'C:/Users/lg/Desktop/Today/CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(blueReportPath);
  const ws = wb.worksheets[0];

  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const vals = [];
    for (let c = 1; c <= 15; c++) {
      vals.push(row.getCell(c).value);
    }
    console.log(`R${r}:`, JSON.stringify(vals));
  }
}

dumpExactRows().catch(console.error);
