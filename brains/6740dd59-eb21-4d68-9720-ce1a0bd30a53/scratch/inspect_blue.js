const path = require('path');
const workspaceRoot = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store';
const ExcelJS = require(path.join(workspaceRoot, 'node_modules/exceljs'));

async function main() {
  const filePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  console.log('Worksheets:', wb.worksheets.map(w => w.name));

  for (const ws of wb.worksheets) {
    console.log(`\n--- Sheet: ${ws.name} (Rows: ${ws.rowCount}) ---`);
    const headerRow = ws.getRow(1);
    console.log('Header:', headerRow.values);

    let blueCount = 0;
    ws.eachRow((row, rowNumber) => {
      let isRowBlue = false;
      const blueCells = [];

      row.eachCell((cell, colNumber) => {
        const fill = cell.fill;
        const font = cell.font;
        
        let colorStr = '';
        if (fill && fill.type === 'pattern' && fill.fgColor) {
          colorStr += 'fill:' + JSON.stringify(fill.fgColor) + ' ';
        }
        if (font && font.color) {
          colorStr += 'font:' + JSON.stringify(font.color) + ' ';
        }

        // Check for blue: ARGB usually starts with FF and has high B, or theme colors
        // Let's inspect any colored cells
        if (fill && fill.fgColor) {
          const fg = fill.fgColor;
          const argb = (fg.argb || '').toUpperCase();
          // Blue usually has high blue component e.g. FF0000FF, 4F81BD, 1F497D, etc.
          // or theme colors
          blueCells.push({ col: colNumber, val: cell.value, fg, fontColor: font?.color });
        }
      });

      if (blueCells.length > 0) {
        blueCount++;
        if (blueCount <= 20) {
          console.log(`Row ${rowNumber} colored cells:`, JSON.stringify(blueCells));
        }
      }
    });
    console.log(`Total rows with colored cells in ${ws.name}: ${blueCount}`);
  }
}

main().catch(console.error);
