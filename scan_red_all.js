const ExcelJS = require('exceljs');
const fs = require('fs');

const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx';

async function scanAllRedCells() {
  const tempPath = 'temp_red_all.xlsx';
  fs.copyFileSync(filePath, tempPath);
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];
  
  console.log('Total rows:', ws.rowCount);
  
  const redList = [];
  
  // Find rows where author is '배현명'
  let bhmStart = null;
  let bhmEnd = null;
  let bhmCount = 0;
  
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const author = row.getCell(1).value;
    if (author === '배현명') {
      if (!bhmStart) bhmStart = rowNumber;
      bhmEnd = rowNumber;
      bhmCount++;
    }
    
    // Check all cells in this row for RED font or RED fill
    for (let c = 1; c <= 30; c++) {
      const cell = row.getCell(c);
      let isRed = false;
      let reason = '';
      
      // Font color
      if (cell.font && cell.font.color) {
        const argb = (cell.font.color.argb || '').toUpperCase();
        if (argb.includes('FF0000') || argb.includes('RED')) {
          isRed = true;
          reason = `Font: ${argb}`;
        }
      }
      // Fill color
      if (cell.fill && cell.fill.fgColor) {
        const argb = (cell.fill.fgColor.argb || '').toUpperCase();
        if (argb.includes('FF0000') || argb.includes('RED')) {
          isRed = true;
          reason = `Fill: ${argb}`;
        }
      }
      
      if (isRed) {
        redList.push({
          rowNumber,
          col: c,
          colHeader: ws.getRow(1).getCell(c).value,
          val: cell.value,
          reason,
          author: row.getCell(1).value,
          name: row.getCell(3).value,
          brno: row.getCell(4).value,
          ceo: row.getCell(5).value,
          phone: row.getCell(8).value,
          homepage: row.getCell(10).value
        });
      }
    }
  });
  
  console.log(`Author '배현명' rows: count=${bhmCount}, start=${bhmStart}, end=${bhmEnd}`);
  console.log('Total red cells found:', redList.length);
  
  if (redList.length > 0) {
    console.log('\n--- LAST 10 RED CELLS ---');
    redList.slice(-10).forEach(r => {
      console.log(`Row ${r.rowNumber} [Col ${r.col}: ${r.colHeader}] (작성자: ${r.author}) 회사: ${r.name} | 대표: ${r.ceo} | 사번: ${r.brno} | 값: ${r.val} (${r.reason})`);
    });
  }
  
  fs.unlinkSync(tempPath);
}

scanAllRedCells().catch(e => console.error(e));
