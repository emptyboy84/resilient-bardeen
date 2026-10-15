const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function checkThemeCells() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];

  const theme5Rows = [];
  const theme8Rows = [];
  const theme9Rows = [];

  ws.eachRow((r, rNum) => {
    let has5 = false, has8 = false, has9 = false;
    r.eachCell((cell, colNum) => {
      const fill = cell.fill;
      if (fill && fill.type === 'pattern' && fill.fgColor) {
        if (fill.fgColor.theme === 5) has5 = true;
        if (fill.fgColor.theme === 8) has8 = true;
        if (fill.fgColor.theme === 9) has9 = true;
      }
    });
    const info = { rowNum: rNum, name: r.getCell(3).value, biz: r.getCell(4).value, s24: r.getCell(17).value, s25: r.getCell(18).value };
    if (has5) theme5Rows.push(info);
    if (has8) theme8Rows.push(info);
    if (has9) theme9Rows.push(info);
  });

  console.log('Theme 5 rows count:', theme5Rows.length, 'sample:', theme5Rows.slice(0, 5));
  console.log('Theme 8 rows count:', theme8Rows.length, 'sample:', theme8Rows.slice(0, 5));
  console.log('Theme 9 rows count:', theme9Rows.length, 'sample:', theme9Rows.slice(0, 5));
}

checkThemeCells().catch(console.error);
