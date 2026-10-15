const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function inspectOrange() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/배현명_실사DB_16컬럼_주황색마킹_최종검증.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.worksheets[0];

  console.log('Sheet name:', ws.name, 'RowCount:', ws.rowCount);
  const markedRows = [];

  ws.eachRow((r, rNum) => {
    let hasColor = false;
    let colorDetails = [];
    r.eachCell((c, cNum) => {
      const fill = c.fill;
      if (fill && fill.fgColor) {
        hasColor = true;
        colorDetails.push({ col: cNum, color: fill.fgColor, val: c.value });
      }
    });
    if (hasColor && rNum <= 20) {
      markedRows.push({ rNum, cells: colorDetails });
    }
  });

  console.log('Sample colored rows:', JSON.stringify(markedRows.slice(0, 5), null, 2));
}

inspectOrange().catch(console.error);
