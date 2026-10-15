const fs = require('fs');
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

async function verifyAll() {
  console.log('========================================================');
  console.log('       FINAL SUBMISSION MASTER DATASET DEEP AUDIT       ');
  console.log('========================================================\n');

  // 1. AUDIT CSV
  const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const cleanContent = csvContent.charCodeAt(0) === 0xFEFF ? csvContent.slice(1) : csvContent;
  const csvRows = parseCSV(cleanContent);
  const csvHeader = csvRows[0];
  const csvData = csvRows.slice(1);

  console.log('--- [1] CSV AUDIT ---');
  console.log('Total Rows (including header):', csvRows.length);
  console.log('Header Columns count:', csvHeader.length);
  console.log('Data Rows count:', csvData.length);

  const csvIssues = {
    colMismatch: [],
    nameMissing: [],
    weirdCol0: [],
    weirdCol1: [],
    bizShiftOrInvalid: [],
    estYearWeird: [],
    estMonthWeird: [],
    closedDateWeird: [],
    empWeird: [],
    salesWeird: [],
    sigunguAbnormal: [],
    newlineInFields: []
  };

  const allowedSigungu = new Set([
    '서구', '해운대구', '남구', '수영구', '사상구', '금정구', '연제구', '중구',
    '동래구', '북구', '동구', '강서구', '사하구', '부산진구', '영도구', '기장군',
    // external valid
    '인천 연수구', '김해시', '밀양시', '창원'
  ]);

  csvData.forEach((r, idx) => {
    const rowNum = idx + 2;
    const name = r[2] ? r[2].trim() : '';

    if (r.length !== 18) csvIssues.colMismatch.push({ rowNum, len: r.length });
    if (!name) csvIssues.nameMissing.push(rowNum);

    const c0 = r[0] ? r[0].trim() : '';
    if (c0 !== '25년 모집단' && c0 !== '게임사업단 리스트') {
      csvIssues.weirdCol0.push({ rowNum, name, val: c0 });
    }

    const c1 = r[1] ? r[1].trim() : '';
    if (c1 && isNaN(c1)) {
      csvIssues.weirdCol1.push({ rowNum, name, val: c1 });
    }

    const biz = r[3] ? r[3].trim() : '';
    if (biz) {
      const cleanBiz = biz.replace(/-/g, '');
      if (cleanBiz.length !== 10 && !/^\d{2,8}$/.test(cleanBiz)) {
        csvIssues.bizShiftOrInvalid.push({ rowNum, name, biz });
      }
    }

    const ey = r[4] ? r[4].trim() : '';
    if (ey && (!/^\d{4}$/.test(ey) || parseInt(ey) < 1900 || parseInt(ey) > 2026)) {
      csvIssues.estYearWeird.push({ rowNum, name, ey });
    }

    const em = r[5] ? r[5].trim() : '';
    if (em && (!/^\d{1,2}$/.test(em) || parseInt(em) < 1 || parseInt(em) > 12)) {
      csvIssues.estMonthWeird.push({ rowNum, name, em });
    }

    const sg = r[9] ? r[9].trim() : '';
    if (sg && !allowedSigungu.has(sg)) {
      csvIssues.sigunguAbnormal.push({ rowNum, name, sg });
    }

    const cd = r[13] ? r[13].trim() : '';
    if (cd && !/^\d{4}-\d{2}-\d{2}$/.test(cd) && cd !== '폐업자' && cd !== '폐업') {
      csvIssues.closedDateWeird.push({ rowNum, name, cd });
    }

    const emp = r[15] ? r[15].trim() : '';
    if (emp && isNaN(emp.replace(/,/g, ''))) {
      csvIssues.empWeird.push({ rowNum, name, emp });
    }

    [16, 17].forEach(c => {
      const s = r[c] ? r[c].trim() : '';
      if (s && s !== '-' && isNaN(s.replace(/,/g, ''))) {
        csvIssues.salesWeird.push({ rowNum, name, col: c, s });
      }
    });

    r.forEach((f, c) => {
      if (f.includes('\n') || f.includes('\r')) {
        csvIssues.newlineInFields.push({ rowNum, col: c, val: f });
      }
    });
  });

  console.log('CSV Audit Results:');
  console.log('  1. Column Count Mismatches (expected 0):', csvIssues.colMismatch.length);
  console.log('  2. Missing Company Names (expected 0):', csvIssues.nameMissing.length);
  console.log('  3. Abnormal Col 0 구분 (expected 0):', csvIssues.weirdCol0.length, csvIssues.weirdCol0);
  console.log('  4. Abnormal Col 1 순번 (expected 0):', csvIssues.weirdCol1.length, csvIssues.weirdCol1);
  console.log('  5. Biz Column Shift/Corruption (expected 0):', csvIssues.bizShiftOrInvalid.length, csvIssues.bizShiftOrInvalid);
  console.log('  6. Est Year Anomalies (expected 0):', csvIssues.estYearWeird.length, csvIssues.estYearWeird);
  console.log('  7. Est Month Anomalies (expected 0):', csvIssues.estMonthWeird.length, csvIssues.estMonthWeird);
  console.log('  8. Sigungu Anomalies (expected 0):', csvIssues.sigunguAbnormal.length, csvIssues.sigunguAbnormal);
  console.log('  9. Closed Date Anomalies (expected 0):', csvIssues.closedDateWeird.length, csvIssues.closedDateWeird);
  console.log(' 10. Emp Count Anomalies (expected 0):', csvIssues.empWeird.length, csvIssues.empWeird);
  console.log(' 11. Sales Anomalies (expected 0):', csvIssues.salesWeird.length, csvIssues.salesWeird);
  console.log(' 12. Newlines in Fields (expected 0):', csvIssues.newlineInFields.length);

  // 2. AUDIT EXCEL
  console.log('\n--- [2] EXCEL AUDIT ---');
  const excelPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx';
  const wb = new xlsx.Workbook();
  await wb.xlsx.readFile(excelPath);

  console.log('Worksheet Count:', wb.worksheets.length);
  wb.worksheets.forEach(ws => {
    console.log(`Sheet [${ws.name}] - Rows: ${ws.rowCount}, Cols: ${ws.columnCount}`);
  });

  const wsCorp = wb.getWorksheet('기업체 리스트');
  const wsPers = wb.getWorksheet('개인 리스트');

  let corpCellsWithFormula = 0;
  let corpNumericSalesCount = 0;
  for (let r = 2; r <= wsCorp.rowCount; r++) {
    const s24 = wsCorp.getRow(r).getCell(17).value;
    const s25 = wsCorp.getRow(r).getCell(18).value;
    if (typeof s24 === 'number') corpNumericSalesCount++;
    if (typeof s25 === 'number') corpNumericSalesCount++;
  }
  console.log('Total Numeric Sales Cells in Excel Sheet 1:', corpNumericSalesCount);
  console.log('Excel Sheet 1 Row Count Match:', wsCorp.rowCount === 2314 ? 'PASS (2,314 rows)' : 'FAIL');
  console.log('Excel Sheet 2 Row Count Match:', wsPers.rowCount === 1023 ? 'PASS (1,023 rows)' : 'FAIL');

  console.log('\n========================================================');
  console.log('               OVERALL VERIFICATION VERDICT             ');
  console.log('========================================================');
  const allPass = Object.values(csvIssues).every(arr => arr.length === 0) &&
                  wsCorp.rowCount === 2314 &&
                  wsPers.rowCount === 1023;
  if (allPass) {
    console.log('>> [SUCCESS] 100% PERFECT! ALL 12 AUDIT CHECKS PASSED WITH 0 ISSUES! <<');
  } else {
    console.log('>> [WARN] SOME ISSUES STILL EXIST! PLEASE CHECK ABOVE OUTPUT! <<');
  }
}

verifyAll().catch(console.error);
