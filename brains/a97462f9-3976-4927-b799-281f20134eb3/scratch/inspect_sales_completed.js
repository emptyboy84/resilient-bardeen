const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function checkAllSalesInCompletedXlsx() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_매출액실사완료.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];

  const salesRows = [];
  ws.eachRow((r, rNum) => {
    if (rNum === 1) return;
    const seq = r.getCell(2).value;
    const name = r.getCell(3).value;
    const biz = r.getCell(4).value;
    const note = r.getCell(15).value;
    const emp = r.getCell(16).value;
    const s24 = r.getCell(17).value;
    const s25 = r.getCell(18).value;

    if (s24 || s25 || (note && (note.includes('매출') || note.includes('공시') || note.includes('출처')))) {
      salesRows.push({
        rNum, seq, name, biz, s24, s25, emp, note
      });
    }
  });

  console.log('Total sales/note rows in _매출액실사완료.xlsx:', salesRows.length);
  console.log('Sample rows with sales:', salesRows.slice(0, 10));
}

checkAllSalesInCompletedXlsx().catch(console.error);
