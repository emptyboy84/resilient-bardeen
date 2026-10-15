const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function inspectTeamCorpInfo() {
  const filePath = 'C:/Users/lg/Desktop/Today/(데이터검증팀)실사 DB 취합_전달용_260720_기업정보.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(filePath);
  
  console.log(`Sheets in team corp info:`);
  wb.worksheets.forEach(ws => console.log(` - ${ws.name} (rows: ${ws.rowCount})`));

  const ws = wb.worksheets[0];
  console.log(`\nHeaders of sheet 0:`, ws.getRow(1).values);
  console.log(`Sample row 2:`, ws.getRow(2).values);
  console.log(`Sample row 3:`, ws.getRow(3).values);
}

inspectTeamCorpInfo().catch(console.error);
