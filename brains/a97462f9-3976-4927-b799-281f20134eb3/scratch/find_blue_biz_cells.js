const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function inspectBlueBizCells() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];
  console.log('Worksheet:', ws.name, 'Rows:', ws.rowCount);

  const blueBizRows = [];

  ws.eachRow((row, rNum) => {
    if (rNum === 1) return; // skip header
    const seq = row.getCell(2).value;
    const name = row.getCell(3).value;
    const bizCell = row.getCell(4); // 사업자번호
    const biz = bizCell.value;

    let isBlue = false;
    let reason = '';

    // Check font color
    if (bizCell.font && bizCell.font.color) {
      const c = bizCell.font.color;
      const argb = c.argb || '';
      const theme = c.theme;
      // Blue theme in Office is usually 4 (Accent 1), or specific blue ARGBs like FF0000FF, FF0070C0, FF00B0F0, FF4F81BD, FF2F5597
      if (argb.includes('0070C0') || argb.includes('00B0F0') || argb.includes('0000FF') || argb.includes('4F81BD') || argb.includes('2F5597') || argb.includes('5B9BD5')) {
        isBlue = true;
        reason = 'font.argb=' + argb;
      } else if (theme === 4 || theme === 8 || theme === 9) { // Office blue themes
        isBlue = true;
        reason = 'font.theme=' + theme;
      } else if (argb && argb !== 'FF000000' && !argb.includes('000000')) {
        reason = 'font.other=' + argb;
      }
    }

    // Check fill color
    if (bizCell.fill && bizCell.fill.type === 'pattern' && bizCell.fill.fgColor) {
      const fg = bizCell.fill.fgColor;
      const argb = fg.argb || '';
      const theme = fg.theme;
      if (argb.includes('0070C0') || argb.includes('00B0F0') || argb.includes('0000FF') || argb.includes('4F81BD') || argb.includes('2F5597') || argb.includes('5B9BD5') || argb.includes('D9E1F2')) {
        isBlue = true;
        reason = 'fill.argb=' + argb;
      } else if (theme === 4 || theme === 8 || theme === 9 || theme === 5) {
        isBlue = true;
        reason = 'fill.theme=' + theme;
      }
    }

    // Also check if any cell in row has blue
    let rowAnyBlue = false;
    row.eachCell((c, colNum) => {
      if (c.font && c.font.color) {
        const argb = c.font.color.argb || '';
        const theme = c.font.color.theme;
        if (argb.includes('0070C0') || argb.includes('00B0F0') || argb.includes('0000FF') || theme === 4 || theme === 8 || theme === 9) {
          rowAnyBlue = true;
        }
      }
      if (c.fill && c.fill.fgColor) {
        const argb = c.fill.fgColor.argb || '';
        const theme = c.fill.fgColor.theme;
        if (argb.includes('0070C0') || argb.includes('00B0F0') || theme === 4 || theme === 8 || theme === 9) {
          rowAnyBlue = true;
        }
      }
    });

    if (isBlue || (rowAnyBlue && reason.includes('font'))) {
      blueBizRows.push({
        rNum,
        seq,
        name,
        biz,
        reason,
        s24: row.getCell(17).value,
        s25: row.getCell(18).value,
        note: row.getCell(15).value
      });
    }
  });

  console.log(`Found ${blueBizRows.length} blue biz rows!`);
  blueBizRows.forEach((r, i) => {
    console.log(`[${i+1}] Row ${r.rNum} (Seq ${r.seq}) ${r.name} | Biz: ${r.biz} | Reason: ${r.reason} | S24: ${r.s24} | S25: ${r.s25} | Note: ${r.note}`);
  });
}

inspectBlueBizCells().catch(console.error);
