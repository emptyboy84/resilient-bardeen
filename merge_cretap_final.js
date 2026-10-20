const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

async function mergeAndSaveFullCretap() {
  const origPath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달 (1).xlsx';
  const fullResults = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));

  console.log(`Loading original file: ${origPath}`);
  const wbOrig = new ExcelJS.Workbook();
  await wbOrig.xlsx.readFile(origPath);
  const wsOrig = wbOrig.worksheets[0];

  const targetDir = 'C:/Users/lg/Desktop/Today';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const wbNew = new ExcelJS.Workbook();
  const wsNew = wbNew.addWorksheet('크레탑_부산CT_전화번호검증');

  const tsvRows = [];
  let totalData = 0;
  let originalPhones = 0;
  let newlyAddedPhones = 0;
  let stillMissing = 0;

  wsOrig.eachRow((row, rowNumber) => {
    const values = [];
    for (let c = 1; c <= 17; c++) {
      values.push(row.getCell(c).value !== null && row.getCell(c).value !== undefined ? String(row.getCell(c).value) : '');
    }

    if (rowNumber === 1) {
      // Header row
      tsvRows.push(values);
      const rNew = wsNew.addRow(values);
      rNew.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      rNew.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E79' }
      };
      rNew.alignment = { vertical: 'middle', horizontal: 'center' };
      return;
    }

    totalData++;
    const bizNo = values[5].replace(/[^0-9]/g, '');
    let phone = values[9].trim();
    let isNew = false;

    if (phone) {
      originalPhones++;
    } else {
      if (fullResults[bizNo]) {
        phone = fullResults[bizNo];
        values[9] = phone;
        newlyAddedPhones++;
        isNew = true;
      } else {
        stillMissing++;
      }
    }

    tsvRows.push(values);
    const rNew = wsNew.addRow(values);

    if (isNew) {
      const cell = rNew.getCell(10);
      cell.font = { bold: true, color: { argb: 'FF006100' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC6EFCE' }
      };
    }
  });

  // Adjust column widths
  wsNew.columns.forEach((col, i) => {
    col.width = [6, 26, 12, 10, 18, 15, 18, 25, 45, 16, 12, 10, 10, 10, 10, 10, 10][i] || 15;
  });

  console.log(`\n=== Merge Statistics ===`);
  console.log(`Total companies: ${totalData}`);
  console.log(`Originally had phone: ${originalPhones}`);
  console.log(`Newly verified & added: ${newlyAddedPhones}`);
  console.log(`Still missing: ${stillMissing}`);
  console.log(`Total with phone now: ${originalPhones + newlyAddedPhones} (${((originalPhones + newlyAddedPhones)/totalData*100).toFixed(1)}%)`);

  // 1. Save TXT (TSV format with UTF-8 BOM)
  const txtFileName = '크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';
  const txtFilePath = path.join(targetDir, txtFileName);
  const tsvText = '\uFEFF' + tsvRows.map(r => r.join('\t')).join('\n');
  fs.writeFileSync(txtFilePath, tsvText, 'utf8');
  console.log(`Saved TXT to: ${txtFilePath} (${fs.statSync(txtFilePath).size} bytes)`);

  // 2. Save XLSX
  const xlsxFileName = '크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx';
  const xlsxFilePath = path.join(targetDir, xlsxFileName);
  await wbNew.xlsx.writeFile(xlsxFilePath);
  console.log(`Saved XLSX to: ${xlsxFilePath} (${fs.statSync(xlsxFilePath).size} bytes)`);
}

mergeAndSaveFullCretap();
