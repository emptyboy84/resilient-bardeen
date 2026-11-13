const ExcelJS = require('exceljs');
const fs = require('fs');

async function inspectRange1100_1185() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
  const tempPath = 'temp_inspect_1100.xlsx';
  fs.copyFileSync(filePath, tempPath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];

  for (let r = 1100; r <= 1185; r++) {
    const row = ws.getRow(r);
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const bno = row.getCell(6).value;
    const phoneCell = row.getCell(10);
    const phone = phoneCell.value;
    const fontColor = phoneCell.font?.color?.argb;
    const bgColor = phoneCell.fill?.fgColor?.argb;

    console.log(`Row ${r} (Seq ${seq}): ${name} | 대표: ${ceo} | Phone: ${phone} | Font: ${fontColor} | Bg: ${bgColor}`);
  }
  fs.unlinkSync(tempPath);
}
inspectRange1100_1185();
