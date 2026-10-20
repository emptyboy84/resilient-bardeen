const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

async function mergeAllToUserExcel() {
  const origPath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달 (1).xlsx';
  const userPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const foundFile = 'found_from_row498.json';

  console.log(`Loading original file to index original phone numbers...`);
  const wbOrig = new ExcelJS.Workbook();
  await wbOrig.xlsx.readFile(origPath);
  const wsOrig = wbOrig.worksheets[0];

  const origPhoneMap = new Map();
  wsOrig.eachRow((row, r) => {
    if (r === 1) return;
    const bnoRaw = String(row.getCell(6).value || '').replace(/[^0-9]/g, '');
    const p = row.getCell(10).value;
    if (p) origPhoneMap.set(bnoRaw, String(p).trim());
  });
  console.log(`Original phones indexed: ${origPhoneMap.size}`);

  console.log(`Loading user workbook: ${userPath}`);
  const wbUser = new ExcelJS.Workbook();
  await wbUser.xlsx.readFile(userPath);
  const wsUser = wbUser.worksheets[0];

  const newFound = fs.existsSync(foundFile) ? JSON.parse(fs.readFileSync(foundFile, 'utf8')) : {};
  console.log(`New batch scan results available: ${Object.keys(newFound).length}`);

  let updatedCount = 0;
  const tsvRows = [];

  // Get header
  const header = wsUser.getRow(1).values.slice(1);
  tsvRows.push(header);

  for (let r = 2; r <= wsUser.rowCount; r++) {
    const row = wsUser.getRow(r);
    const bnoRaw = String(row.getCell(6).value || '').replace(/[^0-9]/g, '');
    const currentVal = row.getCell(10).value;

    let finalPhone = currentVal ? String(currentVal).trim() : '';

    // If empty and row >= 498, check newFound
    if (!finalPhone && r >= 498) {
      const match = newFound[bnoRaw];
      if (match && match.phone) {
        finalPhone = match.phone.trim();
        const cell = row.getCell(10);
        cell.value = finalPhone;
        // Apply independent cell style with red font
        cell.style = Object.assign({}, cell.style, {
          font: { name: '맑은 고딕', size: 11, color: { argb: 'FFFF0000' } }
        });
        updatedCount++;
      }
    }

    // Build TSV row (17 columns)
    const rowVals = [];
    for (let c = 1; c <= 17; c++) {
      let v = row.getCell(c).value;
      if (v === null || v === undefined) v = '';
      else if (typeof v === 'object' && v.text) v = v.text;
      rowVals.push(String(v).replace(/\t/g, ' ').replace(/\r?\n/g, ' '));
    }
    tsvRows.push(rowVals);
  }

  console.log(`Newly updated phones from batch: ${updatedCount}`);

  // Save Excel safely
  try {
    await wbUser.xlsx.writeFile(userPath);
    console.log(`Successfully saved updated workbook to: ${userPath}`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const altPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명_최종완료.xlsx';
      await wbUser.xlsx.writeFile(altPath);
      console.log(`[Notice] Primary file open in Excel. Saved updated copy to: ${altPath}`);
    } else {
      throw err;
    }
  }

  // Also save verified master files
  const txtPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';
  fs.writeFileSync(txtPath, '\uFEFF' + tsvRows.map(r => r.join('\t')).join('\n'), 'utf8');
  console.log(`Saved master TXT to: ${txtPath} (${fs.statSync(txtPath).size} bytes)`);

  const masterXlsx = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx';
  try {
    await wbUser.xlsx.writeFile(masterXlsx);
    console.log(`Saved master XLSX to: ${masterXlsx}`);
  } catch(e) {}
}

if (require.main === module) {
  mergeAllToUserExcel().catch(e => console.error('Error:', e));
}

module.exports = { mergeAllToUserExcel };
