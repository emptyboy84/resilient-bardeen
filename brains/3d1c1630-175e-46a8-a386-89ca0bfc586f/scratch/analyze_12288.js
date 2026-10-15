const fs = require('fs');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function analyze11847() {
  const currentPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const finalUpdatedPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx';
  const corpPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_법인번호.xlsx';

  const wbC = new ExcelJS.Workbook();
  await wbC.xlsx.readFile(currentPath);
  const wsC = wbC.getWorksheet('기업 정보');

  const wbF = new ExcelJS.Workbook();
  await wbF.xlsx.readFile(finalUpdatedPath);
  const wsF = wbF.getWorksheet('기업 정보');

  const wbCorp = new ExcelJS.Workbook();
  await wbCorp.xlsx.readFile(corpPath);
  const wsCorp = wbCorp.getWorksheet('기업 정보');

  // Let's check row 12288 ((주)모노플로우) in all three!
  console.log('Row 12288 in current:', {
    company: wsC.getRow(12288).getCell(3).value,
    bizno: wsC.getRow(12288).getCell(4).value,
    corpNo: wsC.getRow(12288).getCell(25).value,
    fillCol25: wsC.getRow(12288).getCell(25).fill,
    addr: wsC.getRow(12288).getCell(7).value,
  });

  console.log('Row 12288 in corpPath:', {
    company: wsCorp.getRow(12288).getCell(3).value,
    bizno: wsCorp.getRow(12288).getCell(4).value,
    corpNo: wsCorp.getRow(12288).getCell(25).value,
    fillCol25: wsCorp.getRow(12288).getCell(25).fill,
    addr: wsCorp.getRow(12288).getCell(7).value,
  });

  console.log('Row 12288 in finalUpdated:', {
    company: wsF.getRow(12288).getCell(3).value,
    bizno: wsF.getRow(12288).getCell(4).value,
    corpNo: wsF.getRow(12288).getCell(25).value,
    fillCol25: wsF.getRow(12288).getCell(25).fill,
    addr: wsF.getRow(12288).getCell(7).value,
  });
}

analyze11847().catch(err => console.error(err));
