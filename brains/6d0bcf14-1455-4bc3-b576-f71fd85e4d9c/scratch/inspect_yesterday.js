const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');
const fs = require('fs');

async function inspectYesterday() {
  const f_20261014 = 'C:\\Users\\lg\\Desktop\\Today\\부산기업_전화번호검증_완료본_20261014.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(f_20261014);
  const ws = wb.worksheets[0];

  console.log('20261014 rowCount:', ws.rowCount, 'colCount:', ws.columnCount);
  console.log('Headers:', ws.getRow(1).values.slice(1, 15));
  
  // Find rows around 280-285
  for (let r = 1; r <= Math.min(ws.rowCount, 30); r++) {
    console.log(`R${r}:`, ws.getRow(r).values.slice(1, 7));
  }
}

inspectYesterday().catch(console.error);
