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

// Convert row array to properly escaped CSV line
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

async function buildFinalSubmission() {
  const dir = 'C:/Users/lg/Desktop/Today';
  const csvSourcePath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv');
  const excelSourcePath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx');

  const finalExcelPath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx');
  const finalCSVPath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.csv');

  // 1. Read existing CSV
  const csvContent = fs.readFileSync(csvSourcePath, 'utf8');
  const cleanContent = csvContent.charCodeAt(0) === 0xFEFF ? csvContent.slice(1) : csvContent;
  const parsedRows = parseCSV(cleanContent);
  const dataRows = parsedRows.slice(1);

  console.log(`Parsed ${dataRows.length} data rows from target CSV.`);

  // 2. Read existing Excel to get the "개인 리스트" sheet exactly as-is
  const sourceWb = new xlsx.Workbook();
  await sourceWb.xlsx.readFile(excelSourcePath);
  const personalSheet = sourceWb.getWorksheet('개인 리스트');
  console.log(`Found [개인 리스트] sheet with ${personalSheet.rowCount} rows.`);

  // 3. Process corrections on dataRows
  const correctedData = dataRows.map((r, idx) => {
    // Clone row up to 18 columns (guaranteeing exact 18 columns)
    const row = [];
    for (let c = 0; c < 18; c++) {
      row[c] = r[c] !== undefined && r[c] !== null ? String(r[c]).trim() : '';
    }

    const name = row[2];

    // --- A. Col 0: 구분 typos ---
    if (row[0] === 'e' || row[0] === '`') {
      row[0] = '25년 모집단';
    }

    // --- B. Col 1: 순번 typos ---
    if (name === '와이어스' && row[1] === '휴업자') {
      row[1] = '';
    }

    // --- C. Column Shifts & Specific Known Fixes ---
    // 1) 규성애드 (Row 524)
    if (name === '규성애드') {
      const oldVal = row[3];
      row[3] = '607-81-89668';
      row[4] = '2009';
      row[5] = '2';
      row[6] = '김재동';
      row[7] = '051-502-1500';
      row[8] = '';
      row[9] = '부산진구';
      row[10] = '부산진구 동천로108번길 30, 302호';
      row[11] = '광고';
      if (!row[14]) {
        row[14] = `구주소: ${oldVal}`;
      } else if (!row[14].includes('구주소')) {
        row[14] = `${row[14]} / 구주소: ${oldVal}`;
      }
    }

    // 2) 씨오에스피 (Row 863)
    if (name === '씨오에스피') {
      row[3] = '185-81-02332';
      row[4] = ''; // remove '정보용'
      row[5] = '';
      row[6] = '조상호';
      row[7] = '070-8883-9151';
      row[8] = '051-781-4949';
      row[9] = '해운대구';
      row[10] = '해운대구 반송로513번길 66-35 (석대동)';
      row[11] = '출판';
      row[15] = '16';
      if (!row[14]) {
        row[14] = '종업원수 실사 확인(16명)';
      } else if (!row[14].includes('16명')) {
        row[14] = `${row[14]} / 종업원수 실사 확인(16명)`;
      }
    }

    // 3) 지플러스디자인 (Row 1994)
    if (name === '지플러스디자인' && row[3] === '659-12-') {
      row[3] = '659-12-00090';
    }

    // 4) 원스튜디오 (Row 2311)
    if (name === '원스튜디오') {
      if (row[3] === '5663901417') row[3] = '566-39-01417';
      if (row[4] === '2026년') row[4] = '2026';
    }

    // --- D. 설립연도 typos ---
    if (name === '남천서점' && row[4] === '20012') row[4] = '2012';
    if (name === '일레갈로' && row[4] === '218') row[4] = '2018';
    if (name === '시너샛코리아' && row[4] === '22015') row[4] = '2015';

    // --- E. Sigungu Normalization ---
    if (row[9] === '진구') row[9] = '부산진구';
    if (row[9] === '부산 강서구') row[9] = '강서구';
    if (row[9] === '기장구') row[9] = '기장군';
    if (row[9] === '해운대') row[9] = '해운대구';
    if (row[9] === '금정') row[9] = '금정구';

    // --- F. 폐업날짜 컬럼 내 '휴업자' 분리 정제 ---
    if (row[13] === '휴업자') {
      row[13] = '';
      if (!row[14]) {
        row[14] = '휴업자';
      } else if (!row[14].includes('휴업')) {
        row[14] = `휴업자 / ${row[14]}`;
      }
    }

    // --- G. 종사자수 컬럼 내 괄호 분리 정제 ---
    if (row[15]) {
      const empStr = row[15];
      if (empStr === '???') {
        row[15] = '';
        if (!row[14]) {
          row[14] = '종사자수 미상(확인불가)';
        } else if (!row[14].includes('종사자수')) {
          row[14] = `${row[14]} / 종사자수 미상(확인불가)`;
        }
      } else if (empStr.includes('(')) {
        const m = empStr.match(/^(\d+)\s*\(([^)]+)\)$/);
        if (m) {
          row[15] = m[1];
          const extraInfo = m[2];
          if (!row[14]) {
            row[14] = extraInfo;
          } else if (!row[14].includes(extraInfo)) {
            row[14] = `${row[14]} / ${extraInfo}`;
          }
        }
      }
    }

    // --- H. Unhyphenated 10-digit Biz Numbers ---
    if (/^\d{10}$/.test(row[3])) {
      row[3] = row[3].replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
    }

    // --- I. Unhyphenated 11-digit Phone Numbers ---
    if (/^\d{11}$/.test(row[7])) {
      row[7] = row[7].replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (/^\d{10}$/.test(row[7])) {
      row[7] = row[7].replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }

    // --- J. Clear placeholder hyphens in Sales (없는데이터 다 지워라) ---
    if (row[16] === '-' || row[16] === '--') row[16] = '';
    if (row[17] === '-' || row[17] === '--') row[17] = '';

    return row;
  });

  // 4. Create Final Workbook
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

  // Define soft warm brown fill for missing data (#F8CBAD - Theme 5 주황/갈색 Accent 2 tint 0.6)
  const brownFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8CBAD' }
  };

  let brownPhoneCount = 0;
  let brownBizCount = 0;
  let brownCeoCount = 0;
  let brownAddrCount = 0;

  // Add data rows with proper cell types and number formats
  correctedData.forEach((r, idx) => {
    const rowValues = [];
    for (let c = 0; c < 18; c++) {
      const val = r[c];
      if (val === '' || val === null || val === undefined) {
        rowValues.push('');
      } else if (c === 1) { // 순번
        const num = Number(val);
        rowValues.push(isNaN(num) ? val : num);
      } else if (c === 4 || c === 5) { // 설립연도, 설립월
        const num = Number(val);
        rowValues.push(isNaN(num) ? val : num);
      } else if (c === 15) { // 종사자수
        const num = Number(val);
        rowValues.push(isNaN(num) ? val : num);
      } else if (c === 16 || c === 17) { // 매출액
        const cleanS = val.replace(/,/g, '').trim();
        if (cleanS === '-' || cleanS === '') {
          rowValues.push('');
        } else {
          const num = Number(cleanS);
          rowValues.push(isNaN(num) ? val : num);
        }
      } else {
        rowValues.push(val);
      }
    }

    const excelRow = wsCorp.addRow(rowValues);
    excelRow.height = 20;
    excelRow.font = { name: '맑은 고딕', size: 9 };
    excelRow.alignment = { vertical: 'middle' };

    // Default borders
    for (let c = 1; c <= 18; c++) {
      excelRow.getCell(c).border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
    }

    // Specific column alignments & formats
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

    // 종사자수 (right)
    excelRow.getCell(16).alignment = { vertical: 'middle', horizontal: 'right' };
    if (typeof excelRow.getCell(16).value === 'number') {
      excelRow.getCell(16).numFmt = '#,##0';
    }
    // 매출액 (right with currency format)
    [17, 18].forEach(c => {
      excelRow.getCell(c).alignment = { vertical: 'middle', horizontal: 'right' };
      if (typeof excelRow.getCell(c).value === 'number') {
        excelRow.getCell(c).numFmt = '#,##0';
      }
    });

    // --- APPLY BROWN FILL TO MISSING DATA CELLS ---
    // 1. Missing Phone (연락처 Col 8)
    const phoneVal = r[7] ? String(r[7]).trim() : '';
    if (!phoneVal) {
      excelRow.getCell(8).fill = brownFill;
      brownPhoneCount++;
    }

    // 2. Missing Biz Number (사업자번호 Col 4)
    const bizVal = r[3] ? String(r[3]).trim() : '';
    if (!bizVal) {
      excelRow.getCell(4).fill = brownFill;
      brownBizCount++;
    }

    // 3. Missing CEO (대표자 성함 Col 7)
    const ceoVal = r[6] ? String(r[6]).trim() : '';
    if (!ceoVal) {
      excelRow.getCell(7).fill = brownFill;
      brownCeoCount++;
    }

    // 4. Missing Address (주소 Col 11)
    const addrVal = r[10] ? String(r[10]).trim() : '';
    if (!addrVal) {
      excelRow.getCell(11).fill = brownFill;
      brownAddrCount++;
    }
  });

  console.log(`Brown fills applied during generation:`);
  console.log(`  - 전화번호 없는 셀: ${brownPhoneCount}개`);
  console.log(`  - 사업자번호 없는 셀: ${brownBizCount}개`);
  console.log(`  - 대표자 성함 없는 셀: ${brownCeoCount}개`);
  console.log(`  - 주소 없는 셀: ${brownAddrCount}개`);
  console.log(`  - 총 갈색 음영 셀: ${brownPhoneCount + brownBizCount + brownCeoCount + brownAddrCount}개`);

  // Set column widths for Sheet 1
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

  // Copy personalSheet data and styles
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
  await finalWb.xlsx.writeFile(finalExcelPath);
  console.log('Final Excel successfully created!');

  // 6. Write Synchronized Master CSVs
  const csvLines = [
    toCSVLine(cleanHeader),
    ...correctedData.map(r => toCSVLine(r))
  ];
  const finalCSVString = '\uFEFF' + csvLines.join('\r\n') + '\r\n';

  fs.writeFileSync(csvSourcePath, finalCSVString, 'utf8');
  fs.writeFileSync(finalCSVPath, finalCSVString, 'utf8');
  console.log(`Synchronized master CSV written to:`);
  console.log(`  1) ${csvSourcePath}`);
  console.log(`  2) ${finalCSVPath}`);
}

buildFinalSubmission().catch(console.error);
