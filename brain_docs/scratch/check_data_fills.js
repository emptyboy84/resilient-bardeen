const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');

async function checkDataFills() {
  const f = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(f);
  const ws = wb.worksheets[0];

  console.log('--- Checking data row fills in 심층4차 ---');
  const fills = [];
  for (let r = 2; r <= Math.min(ws.rowCount, 300); r++) {
    const row = ws.getRow(r);
    for (let c = 1; c <= ws.columnCount; c++) {
      const cell = row.getCell(c);
      if (cell.fill && cell.fill.type === 'pattern' && cell.fill.fgColor) {
        fills.push({
          r,
          c,
          colName: ws.getRow(1).getCell(c).value,
          val: cell.value,
          fill: cell.fill
        });
      }
    }
  }

  console.log('Total data row fills found:', fills.length);
  fills.slice(0, 20).forEach(x => {
    console.log(`R${x.r} C${x.c} (${x.colName}): val="${x.val}", color=${JSON.stringify(x.fill.fgColor)}`);
  });
}

checkDataFills().catch(console.error);
