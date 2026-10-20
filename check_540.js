const ExcelJS = require('exceljs');
const fs = require('fs');

async function check540() {
  const origPath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달 (1).xlsx';
  const userPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';

  const wbOrig = new ExcelJS.Workbook();
  await wbOrig.xlsx.readFile(origPath);
  const rowOrig = wbOrig.worksheets[0].getRow(541);
  console.log('Original Row 541 (Seq ' + rowOrig.getCell(1).value + '):', rowOrig.getCell(2).value, '| Phone:', rowOrig.getCell(10).value);

  const wbUser = new ExcelJS.Workbook();
  await wbUser.xlsx.readFile(userPath);
  const rowUser = wbUser.worksheets[0].getRow(541);
  console.log('User Row 541 (Seq ' + rowUser.getCell(1).value + '):', rowUser.getCell(2).value, '| Phone:', rowUser.getCell(10).value, '| Font:', rowUser.getCell(10).font?.color?.argb);
}

check540();
