const fs = require('fs');
const ExcelJS = require('exceljs');

async function check545() {
  const found = JSON.parse(fs.readFileSync('found_from_row498.json', 'utf8'));
  console.log('Found in json for 7368101621:', found['7368101621']);

  const wbUser = new ExcelJS.Workbook();
  await wbUser.xlsx.readFile('C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx');
  const rowUser = wbUser.worksheets[0].getRow(546);
  console.log('Row 546 (Seq ' + rowUser.getCell(1).value + '):', rowUser.getCell(2).value, '| Phone:', rowUser.getCell(10).value, '| Font:', rowUser.getCell(10).font?.color?.argb);
}

check545();
