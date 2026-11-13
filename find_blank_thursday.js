const ExcelJS = require('exceljs');
const fs = require('fs');

async function findBlankRowsUpToThursday() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
  const tempPath = 'temp_blank_thursday.xlsx';
  fs.copyFileSync(filePath, tempPath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];

  const blanks = [];
  // Thursday ended at Seq 1106 (Row 1107)
  for (let r = 2; r <= 1107; r++) {
    const row = ws.getRow(r);
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const bno = row.getCell(6).value;
    const phone = row.getCell(10).value;

    if (!phone && name) {
      blanks.push({ row: r, seq, name, ceo, bno });
    }
  }

  console.log(`Total blank rows from Row 2 to Row 1107 (Seq 1106): ${blanks.length}`);
  console.log('\nList of blank rows:');
  blanks.forEach(b => console.log(`Row ${b.row} (Seq ${b.seq}): ${b.name} | 대표: ${b.ceo} | 사업자: ${b.bno}`));

  fs.unlinkSync(tempPath);
}
findBlankRowsUpToThursday();
