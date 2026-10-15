const fs = require('fs');
const path = require('path');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

// Parse CSV with robust RFC-4180 quote support
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

async function buildSubmissionWithNewEntriesBrown() {
  const dir = 'C:/Users/lg/Desktop/Today';
  const csvSourcePath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv');
  const excelSourcePath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx');

  const finalExcelPath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx');
  const finalCSVPath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.csv');

  // 1. Read existing Excel to get the "개인 리스트" sheet and original styles/values
  const sourceWb = new xlsx.Workbook();
  await sourceWb.xlsx.readFile(excelSourcePath);
  const origWsCorp = sourceWb.getWorksheet('기업체 리스트');
  const personalSheet = sourceWb.getWorksheet('개인 리스트');

  // 2. Read final verified CSV data
  const csvContent = fs.readFileSync(csvSourcePath, 'utf8');
  const cleanContent = csvContent.charCodeAt(0) === 0xFEFF ? csvContent.slice(1) : csvContent;
  const parsedRows = parseCSV(cleanContent);
  const dataRows = parsedRows.slice(1);

  // Brown fill definition for newly found / newly entered data
  // Accent 2 tint 0.6 (#F8CBAD - Soft Warm Brown / Tan)
  const brownFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8CBAD' }
  };

  // Original blue fill definition (#DDEBF7)
  const blueFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFDDEBF7' }
  };

  // 3. Create fresh Final Workbook
  const finalWb = new xlsx.Workbook();
  finalWb.creator = '배현명';
  finalWb.lastModifiedBy = '배현명';
  finalWb.created = new Date();
  finalWb.modified = new Date();

  // Sheet 1: 기업체 리스트
  const wsCorp = finalWb.addWorksheet('기업체 리스트', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  const cleanHeader = [
    '구분',
    '순번',
    '사업체명',
    '사업자번호',
    '설립연도(연도)',
    '설립연도(월)',
    '대표자 성함',
    '연락처',
    '팩스번호',
    '시군구',
    '주소',
    '업종분류',
    '컨택결과',
    '폐업 날짜',
    '비고',
    '종사자수(명) 25년 기준',
    '24년 매출액(원)',
    '25년 매출액(원)'
  ];

  wsCorp.addRow(cleanHeader);

  // Style header row
  const headerRow = wsCorp.getRow(1);
  headerRow.height = 26;
  headerRow.font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: 'FF1F2937' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF3F4F6' }
  };
  headerRow.border = {
    top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    bottom: { style: 'medium', color: { argb: 'FF9CA3AF' } },
    left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
  };

  let brownCellCount = 0;
  let blueCellCount = 0;
  let clearedEmptyCount = 0;

  dataRows.forEach((r, idx) => {
    const rowNum = idx + 2; // 1-based row in Excel (header is row 1)
    const origRow = origWsCorp ? origWsCorp.getRow(rowNum) : null;

    const rowValues = [];
    for (let c = 0; c < 18; c++) {
      let val = r[c] !== undefined && r[c] !== null ? String(r[c]).trim() : '';

      // Clean empty data / placeholders
      if (val === '-' || val === '--' || val === '없음' || val === 'null') {
        val = '';
        clearedEmptyCount++;
      }

      if (val === '') {
        rowValues.push('');
      } else if (c === 1 || c === 4 || c === 5 || c === 15) { // 순번, 연도, 월, 종사자수
        const num = Number(val);
        rowValues.push(isNaN(num) ? val : num);
      } else if (c === 16 || c === 17) { // 매출액
        const cleanS = val.replace(/,/g, '').trim();
        const num = Number(cleanS);
        rowValues.push(isNaN(num) ? val : num);
      } else {
        rowValues.push(val);
      }
    }

    const excelRow = wsCorp.addRow(rowValues);
    excelRow.height = 20;
    excelRow.font = { name: '맑은 고딕', size: 9 };
    excelRow.alignment = { vertical: 'middle' };

    // Standard thin gray border for all data cells
    for (let c = 1; c <= 18; c++) {
      excelRow.getCell(c).border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
    }

    // Alignments
    excelRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(10).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(13).alignment = { vertical: 'middle', horizontal: 'center' };
    excelRow.getCell(14).alignment = { vertical: 'middle', horizontal: 'center' };

    // Number formats
    excelRow.getCell(16).alignment = { vertical: 'middle', horizontal: 'right' };
    if (typeof excelRow.getCell(16).value === 'number') {
      excelRow.getCell(16).numFmt = '#,##0';
    }
    [17, 18].forEach(colIdx => {
      excelRow.getCell(colIdx).alignment = { vertical: 'middle', horizontal: 'right' };
      if (typeof excelRow.getCell(colIdx).value === 'number') {
        excelRow.getCell(colIdx).numFmt = '#,##0';
      }
    });

    // Check newly found / newly entered cells against original row
    for (let c = 1; c <= 18; c++) {
      let origVal = origRow ? origRow.getCell(c).value : null;
      if (origVal instanceof Date) origVal = origVal.toISOString().split('T')[0];
      const sOrig = origVal !== null && origVal !== undefined ? String(origVal).trim() : '';

      let currVal = excelRow.getCell(c).value;
      const sCurr = currVal !== null && currVal !== undefined ? String(currVal).trim() : '';

      // Check if original cell had blue fill
      let hadBlue = false;
      if (origRow) {
        const origCell = origRow.getCell(c);
        if (origCell.fill && origCell.fill.fgColor) {
          const fg = origCell.fill.fgColor;
          if (fg.theme === 8 || fg.argb === 'FFDDEBF7' || (fg.theme === 5 && fg.tint && fg.tint > 0.7)) {
            hadBlue = true;
          }
        }
      }

      // If cell has newly found/entered data (sCurr is non-empty and differs from sOrig)
      // or if it was an error in original like [object Object]
      const isNewlyEntered = (sCurr !== '' && sCurr !== sOrig);

      if (isNewlyEntered) {
        excelRow.getCell(c).fill = brownFill;
        brownCellCount++;
      } else if (hadBlue && sCurr !== '') {
        excelRow.getCell(c).fill = blueFill;
        blueCellCount++;
      }
    }
  });

  console.log(`Summary of cell markings:`);
  console.log(`  - 새로 찾은/입력된 데이터 갈색 음영 채우기 완료: ${brownCellCount}개`);
  console.log(`  - 기존 원본 파란색 강조 보존: ${blueCellCount}개`);
  console.log(`  - 제거/공란 처리된 더미 데이터: ${clearedEmptyCount}개`);

  // Column widths for Sheet 1
  wsCorp.columns = [
    { width: 15 }, // 구분
    { width: 8 },  // 순번
    { width: 26 }, // 사업체명
    { width: 16 }, // 사업자번호
    { width: 14 }, // 설립연도
    { width: 12 }, // 설립월
    { width: 12 }, // 대표자
    { width: 16 }, // 연락처
    { width: 16 }, // 팩스번호
    { width: 12 }, // 시군구
    { width: 45 }, // 주소
    { width: 14 }, // 업종분류
    { width: 16 }, // 컨택결과
    { width: 14 }, // 폐업 날짜
    { width: 35 }, // 비고
    { width: 18 }, // 종사자수
    { width: 18 }, // 24매출
    { width: 18 }  // 25매출
  ];

  // Sheet 2: 개인 리스트
  const wsPers = finalWb.addWorksheet('개인 리스트', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  for (let r = 1; r <= personalSheet.rowCount; r++) {
    const srcRow = personalSheet.getRow(r);
    const dstRow = wsPers.getRow(r);
    dstRow.height = srcRow.height || 20;

    for (let c = 1; c <= 7; c++) {
      const srcCell = srcRow.getCell(c);
      const dstCell = dstRow.getCell(c);
      dstCell.value = srcCell.value;

      if (r === 1) {
        dstRow.height = 26;
        dstCell.font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: 'FF1F2937' } };
        dstCell.alignment = { vertical: 'middle', horizontal: 'center' };
        dstCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F4F6' }
        };
        dstCell.border = {
          top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          bottom: { style: 'medium', color: { argb: 'FF9CA3AF' } },
          left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
        };
      } else {
        dstCell.font = { name: '맑은 고딕', size: 9 };
        dstCell.alignment = { vertical: 'middle' };
        if (c === 1 || c === 3 || c === 4 || c === 5 || c === 6) {
          dstCell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
        dstCell.border = {
          top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
        };
      }
    }
  }

  // Column widths for Sheet 2
  wsPers.columns = [
    { width: 8 },  // 순번
    { width: 26 }, // 사업체명
    { width: 16 }, // 연락처
    { width: 14 }, // 업종분류
    { width: 16 }, // 컨택결과
    { width: 14 }, // 폐업 날짜
    { width: 35 }  // 비고
  ];

  // 5. Save Final Excel
  console.log(`Writing final Excel to ${finalExcelPath}...`);
  try {
    await finalWb.xlsx.writeFile(finalExcelPath);
    console.log('Final Excel successfully created!');
  } catch (err) {
    if (err.code === 'EBUSY') {
      const fallbackPath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본_최신.xlsx');
      console.log(`File is currently open in Excel! Saving safely to fallback: ${fallbackPath}`);
      await finalWb.xlsx.writeFile(fallbackPath);
      console.log('Fallback Final Excel successfully created!');
    } else {
      throw err;
    }
  }

  // 6. Write Synchronized Master CSVs
  const cleanCsvData = dataRows.map(r => {
    const row = [];
    for (let c = 0; c < 18; c++) {
      let val = r[c] !== undefined && r[c] !== null ? String(r[c]).trim() : '';
      if (val === '-' || val === '--' || val === '없음' || val === 'null') val = '';
      row.push(val);
    }
    return row;
  });

  const csvLines = [
    toCSVLine(cleanHeader),
    ...cleanCsvData.map(r => toCSVLine(r))
  ];
  const finalCSVString = '\uFEFF' + csvLines.join('\r\n') + '\r\n';

  fs.writeFileSync(csvSourcePath, finalCSVString, 'utf8');
  fs.writeFileSync(finalCSVPath, finalCSVString, 'utf8');
  console.log(`Synchronized master CSV written.`);
}

buildSubmissionWithNewEntriesBrown().catch(console.error);
