const ExcelJS = require('exceljs');
const fs = require('fs');

async function getBlankList() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
  const tempPath = 'temp_get_blanks.xlsx';
  fs.copyFileSync(filePath, tempPath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];

  const blanks = [];
  // Row 991 (Seq 990) to Row 1108 (Seq 1107)
  for (let r = 991; r <= 1108; r++) {
    const row = ws.getRow(r);
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const status = row.getCell(4).value;
    const type = row.getCell(5).value;
    const bno = row.getCell(6).value;
    const corpNo = row.getCell(7).value;
    const industry = row.getCell(8).value;
    const addr = row.getCell(9).value;
    const phone = row.getCell(10).value;

    if (!phone && name) {
      blanks.push({
        row: r,
        seq,
        name,
        ceo,
        status,
        type,
        bno: String(bno).trim(),
        corpNo: String(corpNo || '').trim(),
        industry,
        addr
      });
    }
  }

  console.log(`Found ${blanks.length} blank companies in range 991-1108:`);
  fs.writeFileSync('thursday_blanks.json', JSON.stringify(blanks, null, 2), 'utf8');
  console.log('Saved to thursday_blanks.json');
  fs.unlinkSync(tempPath);
}
getBlankList();
