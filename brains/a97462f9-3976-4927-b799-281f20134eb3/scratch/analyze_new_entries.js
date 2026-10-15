const fs = require('fs');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function analyzeUpdates() {
  const wbOriginal = new xlsx.Workbook();
  const wbFinal = new xlsx.Workbook();

  const fileOriginal = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  const fileFinal = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx';

  await wbOriginal.xlsx.readFile(fileOriginal);
  await wbFinal.xlsx.readFile(fileFinal);

  const wsOrig = wbOriginal.getWorksheet('기업체 리스트');
  const wsFinal = wbFinal.getWorksheet('기업체 리스트');

  const updatedCells = [];

  for (let r = 2; r <= wsFinal.rowCount; r++) {
    const rowOrig = wsOrig.getRow(r);
    const rowFinal = wsFinal.getRow(r);
    const name = rowFinal.getCell(3).value;

    for (let c = 1; c <= 18; c++) {
      let vOrig = rowOrig.getCell(c).value;
      let vFinal = rowFinal.getCell(c).value;

      if (vOrig instanceof Date) vOrig = vOrig.toISOString().split('T')[0];
      if (vFinal instanceof Date) vFinal = vFinal.toISOString().split('T')[0];

      const sOrig = vOrig !== null && vOrig !== undefined ? String(vOrig).trim() : '';
      const sFinal = vFinal !== null && vFinal !== undefined ? String(vFinal).trim() : '';

      // Check if newly found or newly entered (i.e. final has value, and differs from original)
      // Or if final fixed an error (like [object Object], 20012, etc.)
      if (sFinal !== '' && sFinal !== sOrig) {
        // Exclude trivial formatting like hyphen removal if value is otherwise identical
        updatedCells.push({
          rowNum: r,
          company: name,
          colIdx: c,
          colName: wsFinal.getRow(1).getCell(c).value,
          origVal: sOrig,
          newVal: sFinal
        });
      }
    }
  }

  console.log(`Total newly found/entered/corrected cells with values: ${updatedCells.length}`);

  const colSummary = {};
  updatedCells.forEach(u => {
    colSummary[u.colName] = (colSummary[u.colName] || 0) + 1;
  });
  console.log('Summary by column:', colSummary);

  console.log('\nTop 20 examples:');
  updatedCells.slice(0, 20).forEach(u => {
    console.log(`Row ${u.rowNum} [${u.company}] ${u.colName}: "${u.origVal}" -> "${u.newVal}"`);
  });
}

analyzeUpdates().catch(console.error);
