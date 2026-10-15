const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');
const path = require('path');

async function checkRowColor() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:\\Users\\lg\\Desktop\\Today\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx');
  const ws = wb.worksheets[0];
  ws.eachRow((row, rowNumber) => {
    const val = row.getCell(3).value; // 사업체명 (Col 3)
    if (val && String(val).includes('블루레코딩')) {
      console.log(`Excel Row Number: ${rowNumber}`);
      for (let col = 1; col <= 19; col++) {
        const cell = row.getCell(col);
        const fill = cell.fill;
        console.log(`Col ${col} (Val: "${cell.value}"): Fill =`, JSON.stringify(fill));
      }
    }
  });
}

checkRowColor();
