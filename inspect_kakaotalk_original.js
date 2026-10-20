const ExcelJS = require('exceljs');

async function inspectOriginal() {
  const filePath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  console.log('Worksheets:', wb.worksheets.map(w => w.name));

  const ws = wb.worksheets[0];
  console.log('Row count:', ws.rowCount);

  // Check header
  const headers = [];
  ws.getRow(1).eachCell((c, col) => headers.push(col + ': ' + c.value));
  console.log('Headers:', headers.join(' | '));

  // Search for '폐업' or '휴업' across ALL rows and columns
  const closedOrSuspended = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    for (let c = 1; c <= 17; c++) {
      const val = row.getCell(c).value ? String(row.getCell(c).value).trim() : '';
      if (val.includes('폐업') || val.includes('휴업')) {
        closedOrSuspended.push({
          row: r,
          col: c,
          seq: row.getCell(1).value,
          name: row.getCell(2).value,
          val: val
        });
      }
    }
  }

  console.log('\nTotal occurrences of 폐업/휴업 across sheet:', closedOrSuspended.length);
  closedOrSuspended.forEach(x => {
    console.log('Row ' + x.row + ' (seq ' + x.seq + ') Col ' + x.col + ': [' + x.name + '] => "' + x.val + '"');
  });

  // Check Row 831 specifically
  console.log('\n--- Row 831 (seq 830) detailed inspect ---');
  const r831 = ws.getRow(831);
  for (let c = 1; c <= 17; c++) {
    const cell = r831.getCell(c);
    const fontStr = cell.font ? JSON.stringify(cell.font) : 'none';
    const fillStr = cell.fill ? JSON.stringify(cell.fill) : 'none';
    console.log('Col ' + c + ': ' + cell.value + ' | font: ' + fontStr + ' | fill: ' + fillStr);
  }

  // Count phone numbers and their colors in Col 10
  let redCount = 0;
  let blackCount = 0;
  let greenCount = 0;
  let totalPhones = 0;
  for (let r = 2; r <= ws.rowCount; r++) {
    const cell = ws.getRow(r).getCell(10);
    const val = cell.value ? String(cell.value).trim() : '';
    if (val) {
      totalPhones++;
      const font = cell.font;
      if (font && font.color && font.color.argb === 'FFFF0000') {
        redCount++;
      } else if (font && font.color && font.color.argb === 'FF006100') {
        greenCount++;
      } else {
        blackCount++;
      }
    }
  }

  console.log('\n--- Col 10 (Phone) Stats ---');
  console.log('Total phones:', totalPhones);
  console.log('Red phones (배현명 님):', redCount);
  console.log('Green phones (AI):', greenCount);
  console.log('Black phones (기본):', blackCount);
}

inspectOriginal().catch(console.error);
