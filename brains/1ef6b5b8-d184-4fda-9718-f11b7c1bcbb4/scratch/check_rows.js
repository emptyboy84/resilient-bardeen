const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/miu_design_registration_update/node_modules/exceljs');

async function check() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/miu_design_registration_update/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
  const ws = wb.getWorksheet('기업 정보');
  
  // 디에스케미칼 was row 12216
  const r12216 = ws.getRow(12216);
  console.log('Row 12216 (디에스케미칼):');
  console.log('Col 2 (비고):', r12216.getCell(2).value);
  console.log('Col 15 (종업원수):', r12216.getCell(15).value);
  console.log('Col 48 (업종_대):', r12216.getCell(48).value);
  console.log('Col 49 (업종_중):', r12216.getCell(49).value);
  console.log('Col 50 (업종_소):', r12216.getCell(50).value);

  // 엠엠허브 was row 12217
  const r12217 = ws.getRow(12217);
  console.log('\nRow 12217 (엠엠허브):');
  console.log('Col 10 (홈페이지):', r12217.getCell(10).value);

  // ㈜미우디자인 is row 12251
  const r12251 = ws.getRow(12251);
  console.log('\nRow 12251 (㈜미우디자인):');
  console.log('Col 6 (우편번호):', r12251.getCell(6).value);
  console.log('Col 7 (주소):', r12251.getCell(7).value);
  console.log('Col 8 (전화번호):', r12251.getCell(8).value);
  console.log('Col 9 (팩스번호):', r12251.getCell(9).value);
  console.log('Col 10 (홈페이지):', r12251.getCell(10).value);
  console.log('Col 11 (이메일):', r12251.getCell(11).value);
  console.log('Col 15 (종업원수):', r12251.getCell(15).value);
  console.log('Col 18 (업종):', r12251.getCell(18).value);
  console.log('Col 25 (법인번호):', r12251.getCell(25).value);
  console.log('Col 31 (결산월):', r12251.getCell(31).value);
  console.log('Col 48 (업종_대):', r12251.getCell(48).value);
  console.log('Col 49 (업종_중):', r12251.getCell(49).value);
  console.log('Col 50 (업종_소):', r12251.getCell(50).value);
}

check().catch(console.error);
