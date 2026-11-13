const ExcelJS = require('exceljs');
const fs = require('fs');

async function inspectRange() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
  const tempPath = 'temp_inspect_range.xlsx';
  fs.copyFileSync(filePath, tempPath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];

  const blanks = [];
  const filled = [];
  for (let r = 1000; r <= 1108; r++) {
    const row = ws.getRow(r);
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const bno = row.getCell(6).value;
    const phone = row.getCell(10).value;
    const font = row.getCell(10).font?.color?.argb;
    const bg = row.getCell(10).fill?.fgColor?.argb;

    if (!phone) {
      blanks.push({ row: r, seq, name, ceo, bno, font, bg });
    } else {
      filled.push({ row: r, seq, name, ceo, bno, phone, font, bg });
    }
  }

  console.log(`Range 1000-1108: Filled=${filled.length}, Blank=${blanks.length}`);
  console.log('\n--- BLANK ROWS (${blanks.length}) ---');
  blanks.forEach(b => console.log(`Row ${b.row} (Seq ${b.seq}): ${b.name} (${b.ceo}, ${b.bno})`));

  console.log('\n--- FILLED ROWS (${filled.length}) ---');
  filled.forEach(f => console.log(`Row ${f.row} (Seq ${f.seq}): ${f.name} (${f.ceo}) -> ${f.phone} [Font: ${f.font}]`));

  fs.unlinkSync(tempPath);
}
inspectRange();
