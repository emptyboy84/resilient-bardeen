const path = require('path');
const workspaceRoot = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store';
const ExcelJS = require(path.join(workspaceRoot, 'node_modules/exceljs'));

async function main() {
  const filePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);

  for (const ws of wb.worksheets) {
    console.log(`\n================ Sheet: ${ws.name} ================`);
    const results = [];

    ws.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      let hasBlue = false;
      const blueDetails = [];

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const fill = cell.fill;
        if (fill && fill.fgColor) {
          const fg = fill.fgColor;
          // Theme 8 is 5B9BD5 (Blue), Theme 4 is 4472C4 (Blue)
          if (fg.theme === 8 || fg.theme === 4) {
            hasBlue = true;
            blueDetails.push({ col: colNumber, fg, val: cell.value });
          }
          if (fg.argb && (fg.argb.includes('DDEBF7') || fg.argb.includes('BDD7EE') || fg.argb.includes('2F5597') || fg.argb.includes('1F4E78') || fg.argb.includes('002060') || fg.argb.includes('0070C0') || fg.argb.includes('00B0F0'))) {
            hasBlue = true;
            blueDetails.push({ col: colNumber, fg, val: cell.value });
          }
        }
        const font = cell.font;
        if (font && font.color) {
          const fc = font.color;
          if (fc.theme === 8 || fc.theme === 4 || (fc.argb && (fc.argb.includes('0070C0') || fc.argb.includes('002060') || fc.argb.includes('2F5597')))) {
            // Check if font is blue
            hasBlue = true;
            blueDetails.push({ col: colNumber, fontColor: fc, val: cell.value });
          }
        }
      });

      if (hasBlue) {
        const vals = Array.isArray(row.values) ? row.values.slice(1) : [];
        results.push({
          rowNumber,
          details: blueDetails,
          values: vals
        });
      }
    });

    console.log(`Found ${results.length} rows with blue highlight:`);
    results.forEach(r => {
      console.log(`[Row ${r.rowNumber}] 순번: ${r.values[1]}, 업체명: ${r.values[2]}, 사업자번호: ${r.values[3]}, 대표자: ${r.values[6]}, 24년매출: ${r.values[16]}, 25년매출: ${r.values[17]}`);
      console.log(`   Blue cells:`, JSON.stringify(r.details));
    });
  }
}

main().catch(console.error);
