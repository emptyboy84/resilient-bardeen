const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function checkBlueSummary() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  console.log('Sheets in summary:', wb.worksheets.map(w => w.name));

  wb.worksheets.forEach(ws => {
    console.log(`\n=== Sheet: ${ws.name} (${ws.rowCount} rows) ===`);
    ws.eachRow((r, rNum) => {
      if (rNum <= 10) {
        console.log(`Row ${rNum}:`, JSON.stringify(r.values));
      }
    });
  });
}

checkBlueSummary().catch(console.error);
