const fs = require('fs');
const path = require('path');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField);
      if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
  }
  return rows;
}

function toCSVLine(fields) {
  return fields.map(f => {
    if (f === null || f === undefined) return '';
    const str = String(f);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

async function applyBrownFillsAndClean() {
  const dir = 'C:/Users/lg/Desktop/Today';
  const targetXlsx = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx');
  const targetCsv = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.csv');
  const primaryCsv = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv');

  console.log('Reading final master Excel...');
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(targetXlsx);
  const wsCorp = wb.getWorksheet('기업체 리스트');

  // Brown fill definition: Theme 5 (Accent 2, Brown/Orange) tint 0.6 (Soft Warm Brown / Tan #F8CBAD)
  const brownFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8CBAD' } // Soft Warm Tan / Brown
  };

  const brownBorder = {
    top: { style: 'thin', color: { argb: 'FFED7D31' } },
    bottom: { style: 'thin', color: { argb: 'FFED7D31' } },
    left: { style: 'thin', color: { argb: 'FFED7D31' } },
    right: { style: 'thin', color: { argb: 'FFED7D31' } }
  };

  let phoneBrownCount = 0;
  let bizBrownCount = 0;
  let ceoBrownCount = 0;
  let addrBrownCount = 0;
  let salesHyphenClearedCount = 0;

  for (let r = 2; r <= wsCorp.rowCount; r++) {
    const row = wsCorp.getRow(r);

    // 1. Phone (Col 8 in Excel: 연락처)
    const phoneCell = row.getCell(8);
    const phoneVal = phoneCell.value ? String(phoneCell.value).trim() : '';
    if (!phoneVal || phoneVal === '-' || phoneVal === '없음') {
      phoneCell.value = '';
      phoneCell.fill = brownFill;
      phoneCell.border = brownBorder;
      phoneBrownCount++;
    }

    // 2. Biz Number (Col 4 in Excel: 사업자번호)
    const bizCell = row.getCell(4);
    const bizVal = bizCell.value ? String(bizCell.value).trim() : '';
    if (!bizVal || bizVal === '-' || bizVal === '없음') {
      bizCell.value = '';
      bizCell.fill = brownFill;
      bizCell.border = brownBorder;
      bizBrownCount++;
    }

    // 3. CEO (Col 7 in Excel: 대표자 성함)
    const ceoCell = row.getCell(7);
    const ceoVal = ceoCell.value ? String(ceoCell.value).trim() : '';
    if (!ceoVal || ceoVal === '-' || ceoVal === '없음') {
      ceoCell.value = '';
      ceoCell.fill = brownFill;
      ceoCell.border = brownBorder;
      ceoBrownCount++;
    }

    // 4. Address (Col 11 in Excel: 주소)
    const addrCell = row.getCell(11);
    const addrVal = addrCell.value ? String(addrCell.value).trim() : '';
    if (!addrVal || addrVal === '-' || addrVal === '없음') {
      addrCell.value = '';
      addrCell.fill = brownFill;
      addrCell.border = brownBorder;
      addrBrownCount++;
    }

    // 5. Sales 24 (Col 17) and Sales 25 (Col 18) - Clean hyphens '[-]'
    [17, 18].forEach(colIdx => {
      const salesCell = row.getCell(colIdx);
      const sVal = salesCell.value ? String(salesCell.value).trim() : '';
      if (sVal === '-' || sVal === '--') {
        salesCell.value = '';
        salesCell.fill = brownFill;
        salesCell.border = brownBorder;
        salesHyphenClearedCount++;
      }
    });
  }

  console.log('=== BROWN FILL & CLEANING APPLIED ===');
  console.log(`1. 전화번호 없는 셀 갈색 채우기: ${phoneBrownCount}개`);
  console.log(`2. 사업자번호 없는 셀 갈색 채우기: ${bizBrownCount}개`);
  console.log(`3. 대표자명 없는 셀 갈색 채우기: ${ceoBrownCount}개`);
  console.log(`4. 주소 없는 셀 갈색 채우기: ${addrBrownCount}개`);
  console.log(`5. 매출액 결측치[-] 제거 및 갈색 채우기: ${salesHyphenClearedCount}개`);
  const totalBrownCells = phoneBrownCount + bizBrownCount + ceoBrownCount + addrBrownCount + salesHyphenClearedCount;
  console.log(`총 갈색 음영 채우기 완료 셀: ${totalBrownCells}개`);

  // Save updated Excel file
  await wb.xlsx.writeFile(targetXlsx);
  console.log(`Saved updated Excel to: ${targetXlsx}`);

  // Also update CSV to clear the '[-]' placeholders so data is 100% clean
  const csvContent = fs.readFileSync(targetCsv, 'utf8');
  const cleanCsvContent = csvContent.charCodeAt(0) === 0xFEFF ? csvContent.slice(1) : csvContent;
  const csvRows = parseCSV(cleanCsvContent);
  const updatedCsvData = csvRows.slice(1).map(r => {
    // Col 16 & Col 17: if '-', set to ''
    if (r[16] && r[16].trim() === '-') r[16] = '';
    if (r[17] && r[17].trim() === '-') r[17] = '';
    return r;
  });

  const finalCsvLines = [
    toCSVLine(csvRows[0]),
    ...updatedCsvData.map(r => toCSVLine(r))
  ];
  const finalCsvStr = '\uFEFF' + finalCsvLines.join('\r\n') + '\r\n';
  fs.writeFileSync(targetCsv, finalCsvStr, 'utf8');
  fs.writeFileSync(primaryCsv, finalCsvStr, 'utf8');
  console.log('Synchronized updated CSVs.');
}

applyBrownFillsAndClean().catch(console.error);
