const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function testFinalFile() {
  const filePath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(filePath);

  console.log('Worksheet count:', wb.worksheets.length);
  const wsCorp = wb.getWorksheet('기업체 리스트');
  const wsPers = wb.getWorksheet('개인 리스트');

  console.log(`[기업체 리스트] Rows: ${wsCorp.rowCount}, Cols: ${wsCorp.columnCount}`);
  console.log(`[개인 리스트] Rows: ${wsPers.rowCount}, Cols: ${wsPers.columnCount}`);

  let brownCells = 0;
  wsCorp.eachRow((r, rNum) => {
    if (rNum === 1) return;
    r.eachCell((c, cNum) => {
      if (c.fill && c.fill.fgColor && c.fill.fgColor.argb === 'FFF8CBAD') {
        brownCells++;
      }
    });
  });

  console.log(`Total verified brown cells in Sheet 1: ${brownCells}`);
}

testFinalFile().catch(console.error);
