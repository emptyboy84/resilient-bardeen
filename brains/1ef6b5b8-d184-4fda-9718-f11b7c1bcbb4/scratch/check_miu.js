const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/miu_design_registration_update/node_modules/exceljs');

async function run() {
  const wb = new ExcelJS.Workbook();
  const filePath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/miu_design_registration_update/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  console.log('Reading workbook...');
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업 정보');
  const headers = ws.getRow(1).values;
  const row = ws.getRow(12251);

  console.log('--- Row 12251 Current Values ---');
  for (let col = 1; col < headers.length; col++) {
    const val = row.getCell(col).value;
    if (val !== null && val !== undefined && val !== '') {
      console.log(`Col ${col} [${headers[col]}]:`, JSON.stringify(val));
    }
  }

  // Also check if 5518501580 is anywhere else
  let foundRows = [];
  ws.eachRow((r, rowNumber) => {
    const bizno = String(r.getCell(4).value || '').replace(/[^0-9]/g, '');
    if (bizno === '5518501580') {
      foundRows.push(rowNumber);
    }
  });
  console.log('Found rows for 5518501580 in Col 4:', foundRows);
}

run().catch(console.error);
