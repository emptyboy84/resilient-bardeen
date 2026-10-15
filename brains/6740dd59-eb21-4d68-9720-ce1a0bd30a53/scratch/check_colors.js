const path = require('path');
const workspaceRoot = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store';
const ExcelJS = require(path.join(workspaceRoot, 'node_modules/exceljs'));

async function main() {
  const filePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업체 리스트');

  const colorStats = {};

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    row.eachCell((cell, colNumber) => {
      const fill = cell.fill;
      if (fill && fill.fgColor) {
        const key = JSON.stringify(fill.fgColor);
        if (!colorStats[key]) colorStats[key] = [];
        if (colorStats[key].length < 5) {
          colorStats[key].push({ row: rowNumber, col: colNumber, val: cell.value });
        }
      }
    });
  });

  console.log('Distinct colors (non-header):');
  for (const [k, samples] of Object.entries(colorStats)) {
    console.log(k, 'Samples:', JSON.stringify(samples));
  }
}

main().catch(console.error);
