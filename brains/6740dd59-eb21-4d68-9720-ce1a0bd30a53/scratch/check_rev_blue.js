const path = require('path');
const workspaceRoot = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store';
const ExcelJS = require(path.join(workspaceRoot, 'node_modules/exceljs'));

async function main() {
  const filePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업체 리스트');

  const colBlueCounts = {};
  const rowsWithRevenue = [];

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const vals = Array.isArray(row.values) ? row.values.slice(1) : [];
    const rev24 = vals[16];
    const rev25 = vals[17];
    if (rev24 !== undefined || rev25 !== undefined) {
      rowsWithRevenue.push({ rowNumber, name: vals[2], bizno: vals[3], rep: vals[6], rev24, rev25 });
    }

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const fill = cell.fill;
      if (fill && fill.fgColor) {
        const fg = fill.fgColor;
        if (fg.theme === 8 || fg.theme === 4 || (fg.argb && (fg.argb.includes('DDEBF7') || fg.argb.includes('BDD7EE')))) {
          colBlueCounts[colNumber] = (colBlueCounts[colNumber] || 0) + 1;
        }
      }
    });
  });

  console.log('Blue cell count by column:', colBlueCounts);
  console.log(`Total rows in sheet with revenue (Col 17 or 18 non-empty): ${rowsWithRevenue.length}`);
  console.log('Rows with revenue:');
  rowsWithRevenue.forEach(r => {
    console.log(`Row ${r.rowNumber} | ${r.name} | Biz: ${r.bizno} | 24매출: ${r.rev24} | 25매출: ${r.rev25}`);
  });
}

main().catch(console.error);
