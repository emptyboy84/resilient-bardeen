const ExcelJS = require('exceljs');

async function inspectNextRows() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx');
  const ws = wb.worksheets[0];
  console.log('--- Inspecting Rows 495 to 515 ---');
  for (let r = 495; r <= 515; r++) {
    const row = ws.getRow(r);
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const bno = row.getCell(6).value;
    const phone = row.getCell(10).value;
    const font = row.getCell(10).font?.color?.argb;
    console.log(`Row ${r} (Seq ${seq}): ${name} | ${ceo} | ${bno} | Phone: ${phone || '(공란)'} | Font: ${font || '기본'}`);
  }
}
inspectNextRows();
