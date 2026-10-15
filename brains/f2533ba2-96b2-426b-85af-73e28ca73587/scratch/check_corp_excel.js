const fs = require('fs');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/extract_corporate_numbers/node_modules/exceljs');

async function checkCorpNoInExcel() {
  const wb = new ExcelJS.Workbook();
  const filePath = 'data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  await wb.xlsx.readFile(filePath);
  
  const sheet = wb.worksheets[0];
  const results = [];
  
  const headerRow = sheet.getRow(1).values;
  const colCorpNo = headerRow.indexOf('법인번호');
  const colCompany = headerRow.indexOf('회사명');
  const colBizno = headerRow.indexOf('사업자번호');
  console.log('colCorpNo index:', colCorpNo, 'colCompany index:', colCompany, 'colBizno index:', colBizno);

  for (let r = 19247; r <= 19415; r++) {
    const row = sheet.getRow(r);
    const company = row.getCell(colCompany).value;
    const bizno = row.getCell(colBizno).value;
    const corpNo = colCorpNo > 0 ? row.getCell(colCorpNo).value : null;
    if (corpNo) {
      results.push({ row: r, company, bizno, corpNo });
    }
  }
  console.log('Total with corpNo:', results.length);
  console.log(results);
}

checkCorpNoInExcel();
