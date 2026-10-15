const fs = require('fs');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/extract_corporate_numbers/node_modules/exceljs');

async function inspectExcelRows() {
  const inputLines = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/f2533ba2-96b2-426b-85af-73e28ca73587/scratch/input_batch.tsv', 'utf-8')
    .split('\n')
    .filter(l => l.trim().length > 0);
  
  const inputBiznos = new Map();
  inputLines.forEach((l, idx) => {
    const parts = l.split('\t');
    if (parts[3]) inputBiznos.set(parts[3].trim(), { idx: idx + 1, name: parts[2] });
  });

  const wb = new ExcelJS.Workbook();
  const filePath = 'data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  await wb.xlsx.readFile(filePath);
  
  const sheet = wb.worksheets[0];
  console.log('Sheet name:', sheet.name, 'Total rows:', sheet.rowCount);
  
  const headerRow = sheet.getRow(1).values;
  console.log('Headers:', headerRow);

  const foundInExcel = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const vals = row.values;
    // Look for bizno
    for (let c = 1; c < vals.length; c++) {
      const cellVal = String(vals[c] || '').replace(/[^0-9]/g, '');
      if (inputBiznos.has(cellVal)) {
        const info = inputBiznos.get(cellVal);
        foundInExcel.push({
          excelRow: rowNumber,
          inputIdx: info.idx,
          name: info.name,
          bizno: cellVal,
          rowVals: vals
        });
        break;
      }
    }
  });

  console.log('Found rows count:', foundInExcel.length);
  if (foundInExcel.length > 0) {
    console.log('First 3 found rows in Excel:');
    foundInExcel.slice(0, 3).forEach(f => {
      console.log(`Excel Row ${f.excelRow} (Input ${f.inputIdx}):`, f.name, f.bizno, f.rowVals);
    });
  }
}

inspectExcelRows();
