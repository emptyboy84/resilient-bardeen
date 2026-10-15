const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function inspectBlueCorps() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];

  const blueCorps = [];

  ws.eachRow((r, rNum) => {
    if (rNum === 1) return;
    const bizCell = r.getCell(4); // Col 4: 사업자번호
    const fill = bizCell.fill;
    let isBlue = false;
    if (fill && fill.fgColor) {
      const fg = fill.fgColor;
      if (fg.theme === 8 || fg.argb === 'FFDDEBF7' || (fg.theme === 5 && fg.tint && fg.tint > 0.7)) {
        isBlue = true;
      }
    }

    if (isBlue) {
      const name = r.getCell(3).value;
      const biz = bizCell.value;
      const s24 = r.getCell(17).value;
      const s25 = r.getCell(18).value;
      const cat = r.getCell(12).value;
      const ceo = r.getCell(7).value;
      const phone = r.getCell(8).value;
      const addr = r.getCell(11).value;
      const note = r.getCell(15).value;

      blueCorps.push({
        rowNum: rNum,
        name,
        biz,
        cat,
        ceo,
        phone,
        addr,
        s24: s24 || '',
        s25: s25 || '',
        hasSales: !!(s24 || s25),
        note: note || ''
      });
    }
  });

  console.log(`Total companies with BLUE business numbers: ${blueCorps.length}`);
  const withSales = blueCorps.filter(c => c.hasSales);
  const withoutSales = blueCorps.filter(c => !c.hasSales);
  console.log(`- With sales: ${withSales.length}`);
  console.log(`- WITHOUT sales (missing sales): ${withoutSales.length}`);

  console.log('\nSample 15 companies WITHOUT sales (blue business numbers):');
  withoutSales.slice(0, 15).forEach((c, i) => {
    console.log(`${i+1}. Row ${c.rowNum} [${c.name}] Biz: [${c.biz}] Cat: [${c.cat}] CEO: [${c.ceo}] Phone: [${c.phone}]`);
  });
}

inspectBlueCorps().catch(console.error);
