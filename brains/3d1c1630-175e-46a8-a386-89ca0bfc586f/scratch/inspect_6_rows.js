const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function inspect() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx');
  const ws = wb.getWorksheet('기업 정보');
  const rows = [5012, 5044, 5060, 5121, 5151, 5237];
  rows.forEach(r => {
    const row = ws.getRow(r);
    const c3 = row.getCell(3).value;
    const c4 = row.getCell(4).value;
    const c5 = row.getCell(5).value;
    const c7 = row.getCell(7).value;
    const c25 = row.getCell(25).value;
    console.log('Row ' + r + ': ' + c3 + ' | 사업자: ' + JSON.stringify(c4) + ' | 대표: ' + c5 + ' | 법인: ' + c25 + ' | 주소: ' + c7);
  });
}

inspect().catch(err => console.error(err));
