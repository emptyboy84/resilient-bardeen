const ExcelJS = require('exceljs');
const fs = require('fs');

async function inspectAllRows() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
  const tempPath = 'temp_inspect_all.xlsx';
  fs.copyFileSync(filePath, tempPath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];

  console.log('Total rows:', ws.rowCount);
  const rows = [];
  for (let r = 980; r <= 1185; r++) {
    const row = ws.getRow(r);
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const bno = row.getCell(6).value;
    const phoneCell = row.getCell(10);
    const phone = phoneCell.value;
    const fontColor = phoneCell.font?.color?.argb;
    const bgColor = phoneCell.fill?.fgColor?.argb;

    rows.push({
      row: r,
      seq,
      name,
      ceo,
      bno,
      phone: phone || null,
      fontColor: fontColor || null,
      bgColor: bgColor || null
    });
  }

  // print summary of rows with phone vs blank
  const withPhone = rows.filter(x => x.phone !== null);
  const withoutPhone = rows.filter(x => x.phone === null && x.name);

  console.log(`Range 980-1185: Total ${rows.length}, With phone: ${withPhone.length}, Blank: ${withoutPhone.length}`);
  console.log('\n--- Rows WITH Phone ---');
  withPhone.forEach(x => {
    console.log(`Row ${x.row} (Seq ${x.seq}): ${x.name} (${x.ceo}) -> ${x.phone} [Font: ${x.fontColor}, Fill: ${x.bgColor}]`);
  });

  console.log('\n--- Rows WITHOUT Phone (Blank) ---');
  withoutPhone.forEach(x => {
    console.log(`Row ${x.row} (Seq ${x.seq}): ${x.name} (${x.ceo}, ${x.bno})`);
  });

  fs.unlinkSync(tempPath);
}
inspectAllRows();
