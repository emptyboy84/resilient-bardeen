const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function inspectWorkbook() {
  const wb = new xlsx.Workbook();
  const filePath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  await wb.xlsx.readFile(filePath);

  console.log('Worksheet count:', wb.worksheets.length);
  wb.worksheets.forEach((ws, idx) => {
    console.log(`Sheet ${idx}: [${ws.name}], rowCount: ${ws.rowCount}, colCount: ${ws.columnCount}`);
    const r1 = ws.getRow(1).values;
    console.log('  Header:', r1);
  });
}

inspectWorkbook();
