const ExcelJS = require('exceljs');
const fs = require('fs');

const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx';

async function scanRedCells() {
  console.log('Reading file:', filePath);
  // Copy to temp to avoid file locking issues
  const tempPath = 'temp_scan.xlsx';
  fs.copyFileSync(filePath, tempPath);
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];
  
  console.log('Total rows in sheet:', ws.rowCount);
  
  let lastRedRow = null;
  let lastRedVal = null;
  let lastRedTarget = null;
  
  const redRows = [];
  const filledRows = [];
  
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // header
    const cell = row.getCell(10); // Col 10: 전화번호
    const val = cell.value;
    
    // check font color
    let isRed = false;
    if (cell.font && cell.font.color) {
      const colorArgb = cell.font.color.argb || '';
      if (colorArgb.includes('FF0000') || colorArgb.includes('ff0000') || colorArgb.includes('RED') || colorArgb.includes('Red')) {
        isRed = true;
      }
    }
    
    if (val !== null && val !== undefined && String(val).trim() !== '') {
      filledRows.push({ rowNumber, no: row.getCell(1).value, name: row.getCell(2).value, val, isRed, font: cell.font });
      if (isRed) {
        lastRedRow = rowNumber;
        lastRedVal = val;
        lastRedTarget = {
          rowNumber,
          no: row.getCell(1).value,
          name: row.getCell(2).value,
          ceo: row.getCell(3).value,
          brno: row.getCell(6).value,
          val
        };
        redRows.push(lastRedTarget);
      }
    }
  });
  
  console.log('--- SCAN RESULTS ---');
  console.log('Total filled phone cells:', filledRows.length);
  console.log('Total red phone cells:', redRows.length);
  
  if (redRows.length > 0) {
    console.log('\nLast 5 RED rows:');
    redRows.slice(-5).forEach(r => {
      console.log(`Row ${r.rowNumber} (연번 ${r.no}): [${r.name}] 대표 ${r.ceo} | 사번 ${r.brno} | 전화번호: ${r.val}`);
    });
    console.log('\n>>> LAST RED TARGET:');
    console.log(JSON.stringify(lastRedTarget, null, 2));
  } else {
    console.log('No red cells found. Last 5 filled rows:');
    filledRows.slice(-5).forEach(r => {
      console.log(`Row ${r.rowNumber} (연번 ${r.no}): [${r.name}] 전화: ${r.val} (isRed: ${r.isRed})`);
    });
  }
  
  // Also check rows around 1100 ~ 1200
  console.log('\nChecking rows 1100 to 1200:');
  for (let r = 1100; r <= 1200; r++) {
    const row = ws.getRow(r);
    const cell = row.getCell(10);
    if (cell.value) {
      console.log(`Row ${r} (연번 ${row.getCell(1).value}): [${row.getCell(2).value}] = ${cell.value} | font:`, cell.font?.color);
    }
  }

  fs.unlinkSync(tempPath);
}

scanRedCells().catch(e => console.error(e));
