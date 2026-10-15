const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function checkCols() {
  const filePath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업체 리스트');

  const colCounts = {};
  ws.eachRow((r, rNum) => {
    if (rNum === 1) return;
    r.eachCell((c, cNum) => {
      if (c.fill && c.fill.fgColor && c.fill.fgColor.argb === 'FFF8CBAD') {
        const colName = ws.getRow(1).getCell(cNum).value || `Col${cNum}`;
        colCounts[colName] = (colCounts[colName] || 0) + 1;
      }
    });
  });

  console.log('Brown cell counts by column:', colCounts);
}

checkCols().catch(console.error);
