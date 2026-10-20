const fs = require('fs');
const ExcelJS = require('exceljs');

async function checkOverlap() {
  const stage1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
  const stage2 = fs.existsSync('stage2_results.json') ? JSON.parse(fs.readFileSync('stage2_results.json', 'utf8')) : {};
  const stage3 = fs.existsSync('stage3_kakao_results.json') ? JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8')) : {};
  const stage4 = fs.existsSync('stage4_verified_results.json') ? JSON.parse(fs.readFileSync('stage4_verified_results.json', 'utf8')) : {};

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx');
  const ws = wb.worksheets[0];

  let canFillFromPrevious = 0;
  const sampleCanFill = [];

  for (let r = 498; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const p = row.getCell(10).value;
    if (!p) {
      const bnoRaw = row.getCell(6).value;
      const bno = String(bnoRaw || '').replace(/[^0-9]/g, '');
      const s4 = stage4[bno];
      const s3 = stage3[bno];
      const s2 = stage2[bno];
      const s1 = stage1[bno];
      const found = s4?.phone || s3?.phone || s2?.phone || s1?.phone;
      if (found) {
        canFillFromPrevious++;
        if (sampleCanFill.length < 5) {
          sampleCanFill.push({ row: r, seq: row.getCell(1).value, name: row.getCell(2).value, phone: found });
        }
      }
    }
  }

  console.log('Total empty in user file from row 498:', 3056);
  console.log('Already in our Stage 1-4 pipeline:', canFillFromPrevious);
  console.log('Still needed completely fresh discovery:', 3056 - canFillFromPrevious);
  console.log('Sample matches from previous pipeline:', sampleCanFill);
}
checkOverlap();
