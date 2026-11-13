const ExcelJS = require('exceljs');
const fs = require('fs');

const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';

async function scanTargetFile() {
  console.log('Reading file:', filePath);
  const tempPath = 'temp_latest.xlsx';
  fs.copyFileSync(filePath, tempPath);
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  
  console.log('Sheets:', wb.worksheets.map(w => w.name));
  const ws = wb.worksheets[0];
  console.log('Total rows in sheet 0:', ws.rowCount);
  
  // Headers
  const r1 = ws.getRow(1);
  const headers = [];
  r1.eachCell({ includeEmpty: true }, (c, col) => {
    headers.push(`C${col}: ${c.value}`);
  });
  console.log('Headers:\n', headers.slice(0, 20).join(' | '));
  
  const redList = [];
  
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    
    // Check all columns for red font or fill
    for (let c = 1; c <= 30; c++) {
      const cell = row.getCell(c);
      let isRed = false;
      let reason = '';
      
      if (cell.font && cell.font.color) {
        const argb = (cell.font.color.argb || '').toUpperCase();
        if (argb.includes('FF0000') || argb.includes('RED') || argb === 'FFFF0000') {
          isRed = true;
          reason = `Font: ${argb}`;
        }
      }
      if (cell.fill && cell.fill.fgColor) {
        const argb = (cell.fill.fgColor.argb || '').toUpperCase();
        if (argb.includes('FF0000') || argb.includes('RED') || argb === 'FFFF0000') {
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
          c1: row.getCell(1).value,
          c2: row.getCell(2).value,
          c3: row.getCell(3).value,
          c4: row.getCell(4).value,
          c5: row.getCell(5).value,
          c6: row.getCell(6).value,
          c7: row.getCell(7).value,
          c8: row.getCell(8).value,
          c9: row.getCell(9).value,
          c10: row.getCell(10).value
        });
      }
    }
  });
  
  console.log('Total red occurrences found:', redList.length);
  if (redList.length > 0) {
    console.log('\n--- LAST 10 RED OCCURRENCES ---');
    redList.slice(-10).forEach(r => {
      console.log(`Row ${r.rowNumber} [Col ${r.col}: ${r.colHeader}] (C1:${r.c1}, C2:${r.c2}, C3:${r.c3}, C4:${r.c4}, C5:${r.c5}, C6:${r.c6}) | 값: ${r.val} (${r.reason})`);
    });
    
    const last = redList[redList.length - 1];
    console.log('\n>>> ABSOLUTE LAST RED ROW:', last.rowNumber);
    console.log('Row details:');
    const lastRow = ws.getRow(last.rowNumber);
    for (let c = 1; c <= 15; c++) {
      console.log(`C${c} (${headers[c-1]}):`, lastRow.getCell(c).value);
    }
    
    console.log('\n>>> NEXT 5 ROWS AFTER LAST RED ROW:');
    for (let r = last.rowNumber + 1; r <= last.rowNumber + 5; r++) {
      const nextRow = ws.getRow(r);
      const vals = [];
      for (let c = 1; c <= 10; c++) {
        vals.push(`C${c}: ${nextRow.getCell(c).value}`);
      }
      console.log(`Row ${r}:`, vals.join(' | '));
    }
  }
  
  fs.unlinkSync(tempPath);
}

scanTargetFile().catch(e => console.error(e));
