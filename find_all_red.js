const ExcelJS = require('exceljs');
const fs = require('fs');

async function findAllRedCells() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
  const tempPath = 'temp_all_red.xlsx';
  fs.copyFileSync(filePath, tempPath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];

  const redRows = [];
  const greenRows = [];
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const phoneCell = row.getCell(10);
    const fontColor = phoneCell.font?.color?.argb;
    const bgColor = phoneCell.fill?.fgColor?.argb;
    const val = phoneCell.value;

    if (fontColor === 'FFFF0000') {
      redRows.push({
        row: rowNumber,
        seq: row.getCell(1).value,
        name: row.getCell(2).value,
        ceo: row.getCell(3).value,
        phone: typeof val === 'object' ? JSON.stringify(val) : val
      });
    } else if (bgColor === 'FFC6EFCE' || fontColor === 'FF006100') {
      greenRows.push({
        row: rowNumber,
        seq: row.getCell(1).value,
        name: row.getCell(2).value,
        ceo: row.getCell(3).value,
        phone: typeof val === 'object' ? JSON.stringify(val) : val
      });
    }
  });

  console.log(`Total Red rows (FFFF0000): ${redRows.length}`);
  console.log(`Total Green rows: ${greenRows.length}`);

  console.log('\n--- Red Rows Summary ---');
  console.log(`First Red: Row ${redRows[0]?.row} (Seq ${redRows[0]?.seq} ${redRows[0]?.name})`);
  console.log(`Last Red: Row ${redRows[redRows.length - 1]?.row} (Seq ${redRows[redRows.length - 1]?.seq} ${redRows[redRows.length - 1]?.name})`);

  console.log('\nAll Red Rows:');
  redRows.forEach(r => console.log(`Row ${r.row} (Seq ${r.seq}): ${r.name} (${r.ceo}) -> ${r.phone}`));

  fs.unlinkSync(tempPath);
}
findAllRedCells();
