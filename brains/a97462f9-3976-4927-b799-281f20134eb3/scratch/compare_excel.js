const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');
const fs = require('fs');

async function compareWithExcel() {
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_매출액실사완료.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  console.log('Sheets in 매출액실사완료:', wb.worksheets.map(w => w.name));

  const ws = wb.getWorksheet('기업체 리스트') || wb.worksheets[0];
  console.log('Sheet name:', ws.name, 'RowCount:', ws.rowCount);

  let excelHasSales24 = 0;
  let excelHasSales25 = 0;
  let excelEmptyBiz = 0;

  ws.eachRow((row, rNum) => {
    if (rNum === 1) return;
    const biz = row.getCell(4).value;
    const s24 = row.getCell(17).value;
    const s25 = row.getCell(18).value;
    if (!biz) excelEmptyBiz++;
    if (s24) excelHasSales24++;
    if (s25) excelHasSales25++;
  });

  console.log('Excel stats -> Has Sales 24:', excelHasSales24, 'Has Sales 25:', excelHasSales25, 'Empty Biz:', excelEmptyBiz);
}

compareWithExcel().catch(console.error);
