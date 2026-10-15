const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function dumpCurated() {
  const blueReportPath = 'C:/Users/lg/Desktop/Today/CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(blueReportPath);
  const ws = wb.worksheets[0];

  const results = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const rowNum = row.getCell(2).value;
    const name = row.getCell(3).value;
    const realBiz = row.getCell(4).value;
    const origBiz = row.getCell(5).value;
    const ceo = row.getCell(6).value;
    const phone = row.getCell(7).value;
    const cat = row.getCell(8).value;
    const status = row.getCell(9).value;
    const employees = row.getCell(10).value;
    const s24 = row.getCell(11).value;
    const s25 = row.getCell(12).value;
    const note = row.getCell(13).value;
    const source = row.getCell(14).value;

    results.push({
      rowNum,
      name,
      realBiz,
      origBiz,
      ceo,
      phone,
      cat,
      status,
      employees,
      s24,
      s25,
      note,
      source
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

dumpCurated().catch(console.error);
