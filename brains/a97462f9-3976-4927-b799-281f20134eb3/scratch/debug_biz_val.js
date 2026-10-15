const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function debugBizVal() {
  const filePath = 'C:/Users/lg/Desktop/Today/(데이터검증팀)실사 DB 취합_전달용_260720_기업정보.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  for (let r = 2; r <= 10; r++) {
    const row = ws.getRow(r);
    const compName = row.getCell(4).value;
    const bizVal5 = row.getCell(5).value;
    const bizVal24 = row.getCell(24).value;
    const salesYear = row.getCell(33).value;
    const salesVal = row.getCell(34).value;
    console.log(`R${r}: Name: [${compName}], Col5: [${bizVal5}] (${typeof bizVal5}), Col24: [${bizVal24}], SalesYear: [${salesYear}], Sales: [${salesVal}]`);
  }
}

debugBizVal().catch(console.error);
