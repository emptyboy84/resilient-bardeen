const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function extractBlueBizRows() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];

  const blueRows = [];

  ws.eachRow((r, rNum) => {
    if (rNum === 1) return;
    const bizCell = r.getCell(4);
    const fill = bizCell.fill;
    const font = bizCell.font;

    let isBlue = false;
    let colorType = '';

    if (fill && fill.fgColor) {
      const t = fill.fgColor.theme;
      const a = fill.fgColor.argb;
      // Theme 8 is Accent 5 (Light Blue / Blue)
      // Theme 9 is Accent 6 (Blue/Purple)
      // Theme 5 is Accent 1 (Blue)
      if (t === 8 || t === 9 || t === 5 || (a && (a.includes('0070C0') || a.includes('00B0F0') || a.includes('D9E1F2') || a.includes('4F81BD')))) {
        isBlue = true;
        colorType = `Fill theme:${t}, argb:${a}`;
      }
    }

    if (font && font.color) {
      const a = font.color.argb;
      const t = font.color.theme;
      if ((a && (a.includes('0070C0') || a.includes('00B0F0') || a.includes('0000FF') || a.includes('4F81BD') || a.includes('2F5597'))) || t === 4 || t === 8 || t === 9) {
        if (a !== 'FF000000') {
          isBlue = true;
          colorType += ` Font argb:${a}, theme:${t}`;
        }
      }
    }

    if (isBlue) {
      blueRows.push({
        rNum,
        seq: r.getCell(2).value,
        name: r.getCell(3).value,
        biz: bizCell.value,
        ceo: r.getCell(7).value,
        phone: r.getCell(8).value,
        cat: r.getCell(12).value,
        s24: r.getCell(17).value,
        s25: r.getCell(18).value,
        note: r.getCell(15).value,
        colorType
      });
    }
  });

  console.log(`Total blue-highlighted business rows: ${blueRows.length}`);
  
  // Categorize
  const withBiz = blueRows.filter(b => b.biz && String(b.biz).trim() !== '');
  const withoutBiz = blueRows.filter(b => !b.biz || String(b.biz).trim() === '');
  console.log(`- With BizNo: ${withBiz.length}`);
  console.log(`- Without BizNo: ${withoutBiz.length}`);

  // Missing sales among those with BizNo
  const missingSalesWithBiz = withBiz.filter(b => (!b.s24 || String(b.s24).trim() === '') && (!b.s25 || String(b.s25).trim() === ''));
  console.log(`- With BizNo and missing sales: ${missingSalesWithBiz.length}`);

  console.log('\n=== All Blue-highlighted Companies with BizNo missing sales ===');
  missingSalesWithBiz.forEach((b, idx) => {
    console.log(`[${idx+1}] R${b.rNum} (Seq ${b.seq}) ${b.name} | Biz: ${b.biz} | CEO: ${b.ceo} | Cat: ${b.cat} | Note: ${b.note}`);
  });
}

extractBlueBizRows().catch(console.error);
