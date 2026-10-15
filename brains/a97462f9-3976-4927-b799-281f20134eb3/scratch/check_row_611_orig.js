const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function checkRow611InOrig() {
  const filePath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];

  const row = ws.getRow(611);
  console.log(`--- Row 611 in Original Excel ---`);
  for (let c = 1; c <= 18; c++) {
    const cell = row.getCell(c);
    console.log(`Col ${c}: value=[${cell.value}], fill=`, cell.fill ? JSON.stringify(cell.fill.fgColor) : 'none');
  }

  console.log(`\n--- Surrounding Rows (608 to 615) ---`);
  for (let r = 608; r <= 615; r++) {
    const rw = ws.getRow(r);
    console.log(`Row ${r}: Name=[${rw.getCell(3).value}], Biz=[${rw.getCell(4).value}], Phone=[${rw.getCell(8).value}], Addr=[${rw.getCell(11).value}]`);
  }
}

checkRow611InOrig().catch(console.error);
