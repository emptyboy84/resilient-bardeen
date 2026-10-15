const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function checkColorsDetail() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];

  const fills = {};
  const fonts = {};

  ws.eachRow((r, rNum) => {
    r.eachCell((cell, colNum) => {
      const fill = cell.fill;
      if (fill && fill.fgColor) {
        const k = JSON.stringify(fill.fgColor);
        if (!fills[k]) fills[k] = [];
        if (fills[k].length < 5) fills[k].push({ rNum, colNum, val: cell.value });
      }
      const font = cell.font;
      if (font && font.color) {
        const k = JSON.stringify(font.color);
        if (!fonts[k]) fonts[k] = [];
        if (fonts[k].length < 5) fonts[k].push({ rNum, colNum, val: cell.value });
      }
    });
  });

  console.log('=== FILLS IN 배현명_.xlsx ===');
  for (const [k, samples] of Object.entries(fills)) {
    console.log(`Fill: ${k} (count sample: ${samples.length})`, samples);
  }

  console.log('\n=== FONTS IN 배현명_.xlsx ===');
  for (const [k, samples] of Object.entries(fonts)) {
    console.log(`Font Color: ${k} (count sample: ${samples.length})`, samples);
  }
}

checkColorsDetail().catch(console.error);
