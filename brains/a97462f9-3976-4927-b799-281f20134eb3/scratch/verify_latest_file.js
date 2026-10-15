const fs = require('fs');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function verifyLatestFile() {
  const filePath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본_최신.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(filePath);

  console.log('Worksheet count:', wb.worksheets.length);
  const wsCorp = wb.getWorksheet('기업체 리스트');
  const wsPers = wb.getWorksheet('개인 리스트');

  console.log(`[기업체 리스트] Rows: ${wsCorp.rowCount}, Cols: ${wsCorp.columnCount}`);
  console.log(`[개인 리스트] Rows: ${wsPers.rowCount}, Cols: ${wsPers.columnCount}`);

  let brownCells = 0;
  let blueCells = 0;
  let numericSales = 0;

  wsCorp.eachRow((r, rNum) => {
    if (rNum === 1) return;
    for (let c = 1; c <= 18; c++) {
      const cell = r.getCell(c);
      if (cell.fill && cell.fill.fgColor) {
        if (cell.fill.fgColor.argb === 'FFF8CBAD') brownCells++;
        if (cell.fill.fgColor.argb === 'FFDDEBF7') blueCells++;
      }
      if ((c === 17 || c === 18) && typeof cell.value === 'number') {
        numericSales++;
      }
    }
  });

  console.log(`Verified in _최신.xlsx:`);
  console.log(`- Brown cells (새로 찾은/입력된 데이터): ${brownCells}`);
  console.log(`- Blue cells (기존 원본 강조 보존): ${blueCells}`);
  console.log(`- Numeric sales cells (숫자형 매출액 셀): ${numericSales}`);
}

verifyLatestFile().catch(console.error);
