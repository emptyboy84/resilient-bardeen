const fs = require('fs');
const ExcelJS = require('exceljs');

async function extractMissing() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  const missing = [];
  for (let r = 498; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const phone = row.getCell(10).value;
    if (!phone) {
      const seq = row.getCell(1).value;
      const name = String(row.getCell(2).value || '').trim();
      const ceo = String(row.getCell(3).value || '').trim();
      const bnoRaw = String(row.getCell(6).value || '').trim();
      const bno = bnoRaw.replace(/[^0-9]/g, '');
      const corpNo = String(row.getCell(7).value || '').trim();
      const industry = String(row.getCell(8).value || '').trim();
      const address = String(row.getCell(9).value || '').trim();

      missing.push({
        row: r,
        seq,
        name,
        ceo,
        bno,
        bnoFormatted: bnoRaw,
        corpNo,
        industry,
        address
      });
    }
  }

  console.log(`Total missing targets from Row 498: ${missing.length}`);
  fs.writeFileSync('missing_targets_phase2.json', JSON.stringify(missing, null, 2), 'utf8');
  console.log(`Saved targets to missing_targets_phase2.json`);
}

extractMissing();
