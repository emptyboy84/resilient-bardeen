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
    const blueCols = [];

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const fill = cell.fill;
      if (fill && fill.fgColor) {
        const fg = fill.fgColor;
        // Theme 8 is 5B9BD5, Theme 4 is 4472C4
        if (fg.theme === 8 || fg.theme === 4 || (fg.argb && (fg.argb.includes('DDEBF7') || fg.argb.includes('BDD7EE')))) {
          hasBlue = true;
          blueCols.push(colNumber);
        }
      }
    });

    if (hasBlue) {
      const vals = Array.isArray(row.values) ? row.values.slice(1) : [];
      blueRows.push({
        rowNumber,
        blueCols,
        sn: vals[1],
        name: vals[2],
        bizno: vals[3],
        rep: vals[6],
        phone: vals[7],
        rev24: vals[16],
        rev25: vals[17]
      });
    }
  });

  console.log(`Total blue rows found: ${blueRows.length}`);

  // Let's filter out rows where it's only a single cell vs full row or specific pattern
  // Check which rows have bizno or non-empty bizno
  const withBizno = blueRows.filter(r => r.bizno);
  const withoutBizno = blueRows.filter(r => !r.bizno);

  console.log(`Blue rows with bizno: ${withBizno.length}`);
  console.log(`Blue rows without bizno: ${withoutBizno.length}`);

  console.log('\n--- Blue rows WITH Bizno ---');
  withBizno.forEach(r => {
    console.log(`Row ${r.rowNumber} | cols: ${r.blueCols.join(',')} | ${r.name} | ${r.bizno} | ${r.rep} | 24매출: ${r.rev24} | 25매출: ${r.rev25}`);
  });

  console.log('\n--- Blue rows WITHOUT Bizno (first 20) ---');
  withoutBizno.slice(0, 20).forEach(r => {
    console.log(`Row ${r.rowNumber} | cols: ${r.blueCols.join(',')} | ${r.name} | ${r.rep}`);
  });
}

main().catch(console.error);
