const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function inspectRows() {
  const wb = new ExcelJS.Workbook();
  const filePath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  console.log('Loading workbook...');
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업 정보');
  
  // Check row 11346 to 12348
  console.log('Row 11345:', JSON.stringify(ws.getRow(11345).values));
  console.log('Row 11346:', JSON.stringify(ws.getRow(11346).values));
  console.log('Row 11347:', JSON.stringify(ws.getRow(11347).values));
  console.log('Row 11846:', JSON.stringify(ws.getRow(11846).values));
  console.log('Row 11847:', JSON.stringify(ws.getRow(11847).values));
  console.log('Row 12346:', JSON.stringify(ws.getRow(12346).values));
  console.log('Row 12347:', JSON.stringify(ws.getRow(12347).values));
  console.log('Row 12348:', JSON.stringify(ws.getRow(12348).values));

  // Count rows where 실사자 is 배현명
  let count = 0;
  for (let r = 11340; r <= 12350; r++) {
    const val = ws.getRow(r).getCell(1).value;
    if (val && String(val).includes('배현명')) {
      count++;
    }
  }
  console.log(`Total rows with 배현명 between 11340 and 12350: ${count}`);
}

inspectRows().catch(err => console.error(err));
