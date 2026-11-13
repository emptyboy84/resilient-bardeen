const ExcelJS = require('exceljs');

async function checkRows() {
  const filePath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  [1035, 1036, 1037].forEach(r => {
    const row = ws.getRow(r);
    console.log(`Row ${r} (Seq ${row.getCell(1).value}): ${row.getCell(2).value} | Phone: ${row.getCell(10).value}`);
  });
}

checkRows().catch(console.error);
