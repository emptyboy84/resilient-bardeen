const path = require('path');
const workspaceRoot = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store';
const ExcelJS = require(path.join(workspaceRoot, 'node_modules/exceljs'));

async function main() {
  const filePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업체 리스트');

  const blueRows = [];

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    let hasBlue = false;
    let blueCol = null;
    let blueColor = null;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const fill = cell.fill;
      if (fill && fill.fgColor) {
        const fg = fill.fgColor;
        if (fg.theme === 8 || fg.theme === 4 || (fg.argb && (fg.argb.includes('DDEBF7') || fg.argb.includes('BDD7EE')))) {
          hasBlue = true;
          blueCol = colNumber;
          blueColor = fg;
        }
      }
    });

    if (hasBlue) {
      const vals = Array.isArray(row.values) ? row.values.slice(1) : [];
      blueRows.push({
        rowNumber,
        blueCol,
        blueColor,
        sn: vals[1],
        name: vals[2],
        bizno: vals[3],
        rep: vals[6],
        phone: vals[7],
        addr: vals[10],
        rev24: vals[16],
        rev25: vals[17]
      });
    }
  });

  console.log(`Total blue rows: ${blueRows.length}`);
  console.log('Summary of first 30 blue rows:');
  blueRows.slice(0, 30).forEach(r => {
    console.log(`Row ${r.rowNumber} | ${r.name} | Biz: ${r.bizno} | Rep: ${r.rep} | 24매출: ${r.rev24} | 25매출: ${r.rev25}`);
  });

  if (blueRows.length > 30) {
    console.log(`\nRemaining ${blueRows.length - 30} blue rows:`);
    blueRows.slice(30).forEach(r => {
      console.log(`Row ${r.rowNumber} | ${r.name} | Biz: ${r.bizno} | Rep: ${r.rep} | 24매출: ${r.rev24} | 25매출: ${r.rev25}`);
    });
  }
}

main().catch(console.error);
