const fs = require('fs');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function extractBlueTargets() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];

  const targets = [];

  ws.eachRow((r, rNum) => {
    if (rNum === 1) return;
    const bizCell = r.getCell(4);
    const fill = bizCell.fill;
    let isBlue = false;
    if (fill && fill.fgColor) {
      const fg = fill.fgColor;
      if (fg.theme === 8 || fg.argb === 'FFDDEBF7' || (fg.argb && fg.argb.includes('DDEBF7'))) {
        isBlue = true;
      }
    }

    if (isBlue) {
      const name = r.getCell(3).value ? String(r.getCell(3).value).trim() : '';
      const biz = bizCell.value ? String(bizCell.value).trim() : '';
      const s24 = r.getCell(17).value;
      const s25 = r.getCell(18).value;
      const cat = r.getCell(12).value ? String(r.getCell(12).value).trim() : '';
      const ceo = r.getCell(7).value ? String(r.getCell(7).value).trim() : '';
      const phone = r.getCell(8).value ? String(r.getCell(8).value).trim() : '';
      const addr = r.getCell(11).value ? String(r.getCell(11).value).trim() : '';
      const note = r.getCell(15).value ? String(r.getCell(15).value).trim() : '';

      targets.push({
        rowNum: rNum,
        name,
        biz,
        cat,
        ceo,
        phone,
        addr,
        s24: s24 ? String(s24).trim() : '',
        s25: s25 ? String(s25).trim() : '',
        hasSales: !!(s24 || s25),
        note
      });
    }
  });

  const missingSalesTargets = targets.filter(t => !t.hasSales);
  console.log(`Total blue targets: ${targets.length}`);
  console.log(`With sales in orig: ${targets.length - missingSalesTargets.length}`);
  console.log(`Missing sales in orig: ${missingSalesTargets.length}`);

  const withBiz = missingSalesTargets.filter(t => t.biz && t.biz.length >= 10);
  console.log(`- Among missing sales, with valid biz number: ${withBiz.length}`);
  const withoutBiz = missingSalesTargets.filter(t => !t.biz || t.biz.length < 10);
  console.log(`- Among missing sales, WITHOUT valid biz number: ${withoutBiz.length}`);

  fs.writeFileSync(
    'C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/blue_missing_sales_targets.json',
    JSON.stringify(missingSalesTargets, null, 2),
    'utf8'
  );
  console.log('Saved to scratch/blue_missing_sales_targets.json');
}

extractBlueTargets().catch(console.error);
