const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function checkColors() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];
  console.log('Sheet name:', ws.name, 'RowCount:', ws.rowCount);

  const colorCounts = {};
  const blueRows = [];

  ws.eachRow((r, rNum) => {
    let rowHasBlue = false;
    r.eachCell((cell, colNum) => {
      const fill = cell.fill;
      if (fill && fill.type === 'pattern' && fill.fgColor) {
        const argb = fill.fgColor.argb || fill.fgColor.theme;
        colorCounts[argb] = (colorCounts[argb] || 0) + 1;
        // Check if blue-ish
        const s = String(argb).toUpperCase();
        if (s.includes('00B0F0') || s.includes('0070C0') || s.includes('4F81BD') || s.includes('5B9BD5') || s.includes('D9E1F2') || s.includes('2F5597') || s.includes('BLUE') || s.startsWith('FF00') && s.length === 8) {
          rowHasBlue = true;
        }
      }
    });
    if (rowHasBlue) {
      blueRows.push({
        rowNum: rNum,
        name: r.getCell(3).value,
        biz: r.getCell(4).value,
        s24: r.getCell(17).value,
        s25: r.getCell(18).value
      });
    }
  });

  console.log('Fill color counts:', colorCounts);
  console.log('Total blue rows detected:', blueRows.length);
  if (blueRows.length > 0) {
    console.log('Sample blue rows (first 10):', blueRows.slice(0, 10));
  }
}

checkColors().catch(console.error);
