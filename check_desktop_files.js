const ExcelJS = require('exceljs');

async function checkDesktopFiles() {
  const files = [
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx'
  ];

  for (const f of files) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(f);
    const ws = wb.worksheets[0];
    const row = ws.getRow(1107);
    console.log(`File: ${f}`);
    console.log(`Row 1107: Seq: ${row.getCell(1).value}, Name: ${row.getCell(2).value}, Phone: ${row.getCell(10).value}`);
  }
}

checkDesktopFiles().catch(console.error);
