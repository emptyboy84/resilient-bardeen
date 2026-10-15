const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function verifyColorsBoth() {
  const filePath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(filePath);

  const wsCorp = wb.getWorksheet('기업체 리스트');

  let brownCells = 0;
  let blueCells = 0;
  let noFillCells = 0;

  const brownByCol = {};
  const blueByCol = {};

  wsCorp.eachRow((r, rNum) => {
    if (rNum === 1) return;
    for (let c = 1; c <= 18; c++) {
      const cell = r.getCell(c);
      if (cell.fill && cell.fill.fgColor) {
        const argb = cell.fill.fgColor.argb;
        if (argb === 'FFF8CBAD') {
          brownCells++;
          brownByCol[c] = (brownByCol[c] || 0) + 1;
        } else if (argb === 'FFDDEBF7') {
          blueCells++;
          blueByCol[c] = (blueByCol[c] || 0) + 1;
        }
      } else {
        noFillCells++;
      }
    }
  });

  console.log('=== COLOR VERIFICATION REPORT ===');
  console.log(`- 갈색 (새로 찾은/수정된 데이터 #F8CBAD): ${brownCells}개 셀`);
  console.log(`  컬럼별 갈색 분포:`, brownByCol);
  console.log(`- 파란색 (기존 원본 강조 보존 #DDEBF7): ${blueCells}개 셀`);
  console.log(`  컬럼별 파란색 분포:`, blueByCol);
  console.log(`- 기본 셀 (무채색/일반): ${noFillCells}개 셀`);
}

verifyColorsBoth().catch(console.error);
