const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function scanBizColColors() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];

  const results = [];

  ws.eachRow((row, rNum) => {
    if (rNum === 1) return;
    const bizCell = row.getCell(4); // 사업자번호
    const nameCell = row.getCell(3); // 사업체명
    const seq = row.getCell(2).value;

    let fontColor = null;
    if (bizCell.font && bizCell.font.color) {
      fontColor = bizCell.font.color;
    }

    let fillColor = null;
    if (bizCell.fill && bizCell.fill.fgColor) {
      fillColor = bizCell.fill.fgColor;
    }

    // Is there any color specifically on the bizCell?
    if (fontColor || fillColor) {
      results.push({
        rNum,
        seq,
        name: nameCell.value,
        biz: bizCell.value,
        fontColor,
        fillColor,
        s24: row.getCell(17).value,
        s25: row.getCell(18).value
      });
    }
  });

  console.log(`Total rows with colored BizCell: ${results.length}`);
  // Group by color characteristics
  const groups = {};
  results.forEach(r => {
    const key = JSON.stringify({ font: r.fontColor, fill: r.fillColor });
    groups[key] = (groups[key] || 0) + 1;
  });
  console.log('Color groupings on BizCell:', groups);

  // Print all distinct items
  results.forEach((r, idx) => {
    const fStr = r.fontColor ? (r.fontColor.argb || 'theme:' + r.fontColor.theme) : 'none';
    const fillStr = r.fillColor ? (r.fillColor.argb || 'theme:' + r.fillColor.theme) : 'none';
    console.log(`[${idx+1}] R${r.rNum} (Seq ${r.seq}) ${r.name} | Biz: ${r.biz} | Font: ${fStr} | Fill: ${fillStr} | S24: ${r.s24} | S25: ${r.s25}`);
  });
}

scanBizColColors().catch(console.error);
