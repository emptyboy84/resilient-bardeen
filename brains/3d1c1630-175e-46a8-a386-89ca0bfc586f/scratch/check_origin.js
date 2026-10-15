const fs = require('fs');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function checkOrigin() {
  const currentPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const finalPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx';
  const corpPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_법인번호.xlsx';

  console.log('Inspecting files...');
  const wbC = new ExcelJS.Workbook();
  await wbC.xlsx.readFile(currentPath);
  const wsC = wbC.getWorksheet('기업 정보');

  const wbF = new ExcelJS.Workbook();
  await wbF.xlsx.readFile(finalPath);
  const wsF = wbF.getWorksheet('기업 정보');

  const wbCorp = new ExcelJS.Workbook();
  await wbCorp.xlsx.readFile(corpPath);
  const wsCorp = wbCorp.getWorksheet('기업 정보');

  // Let's check row 11847 in current, final, corp
  console.log('Row 11847 current col 7 (address):', wsC.getRow(11847).getCell(7).value);
  console.log('Row 11847 final col 7 (address):', wsF.getRow(11847).getCell(7).value);
  console.log('Row 11847 corp col 7 (address):', wsCorp.getRow(11847).getCell(7).value);

  // In finalPath, how many empty addresses are there in 11847..12346?
  let emptyAddrFinal = 0;
  for (let r = 11847; r <= 12346; r++) {
    const val = wsF.getRow(r).getCell(7).value;
    if (!val || String(val).trim() === '') emptyAddrFinal++;
  }
  console.log('Empty addresses in 11847..12346 in finalPath:', emptyAddrFinal);

  // In currentPath, how many empty addresses are there in 11847..12346?
  let emptyAddrCurrent = 0;
  for (let r = 11847; r <= 12346; r++) {
    const val = wsC.getRow(r).getCell(7).value;
    if (!val || String(val).trim() === '') emptyAddrCurrent++;
  }
  console.log('Empty addresses in 11847..12346 in currentPath:', emptyAddrCurrent);

  // In corpPath, how many empty addresses are there in 11847..12346?
  let emptyAddrCorp = 0;
  for (let r = 11847; r <= 12346; r++) {
    const val = wsCorp.getRow(r).getCell(7).value;
    if (!val || String(val).trim() === '') emptyAddrCorp++;
  }
  console.log('Empty addresses in 11847..12346 in corpPath:', emptyAddrCorp);
}

checkOrigin().catch(err => console.error(err));
