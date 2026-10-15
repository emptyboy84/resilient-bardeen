const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function inspectAllFills() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];

  const colorRows = {};

  ws.eachRow((r, rNum) => {
    if (rNum === 1) return; // header
    r.eachCell((c, cNum) => {
      const fill = c.fill;
      if (fill && fill.fgColor) {
        const key = JSON.stringify(fill.fgColor);
        if (!colorRows[key]) colorRows[key] = [];
        colorRows[key].push({ rNum, cNum, colName: ws.getRow(1).getCell(cNum).value, val: c.value, company: r.getCell(3).value });
      }
    });
  });

  console.log('=== ALL FILL COLORS IN DATA ROWS ===');
  for (const [k, rows] of Object.entries(colorRows)) {
    console.log(`\nColor: ${k} (Total occurrences: ${rows.length})`);
    console.log('Sample rows:', rows.slice(0, 10));
  }
}

inspectAllFills().catch(console.error);
