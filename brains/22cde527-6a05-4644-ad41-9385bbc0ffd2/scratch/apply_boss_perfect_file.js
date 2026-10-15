const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const missingFile = path.join(SCRATCH_DIR, 'missing_421.json');
const masterFile = path.join(SCRATCH_DIR, 'master_verified_194.json');

const targetXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const basePristinePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';

const missingList = JSON.parse(fs.readFileSync(missingFile, 'utf8'));
const missingMap = {};
for (const m of missingList) {
  missingMap[m.rowNumber] = m;
}

const masterList = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
const masterMap = {};
for (const item of masterList) {
  masterMap[item.rowNumber] = item;
}

const redBoldFont = {
  name: '맑은 고딕',
  size: 10,
  color: { argb: 'FFFF0000' },
  bold: true
};

const blackRegularFont = {
  name: '맑은 고딕',
  size: 10,
  color: { argb: 'FF000000' },
  bold: false
};

const blackBoldFont = {
  name: '맑은 고딕',
  size: 10,
  color: { argb: 'FF000000' },
  bold: true
};

async function execute() {
  console.log('Reading base file...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(basePristinePath);
  const ws = wb.worksheets[0];

  // Set Sheet Title
  ws.name = '2026_부산_CT산업_실태조사';

  // 1. Clean Header Row
  const hRow = ws.getRow(1);
  const headerTitles = [
    '구분', '기존행번호', '사업체명', '사업자번호', '설립연도(연도)', '설립연도(월)',
    '대표자 성함', '연락처', '팩스번호', '시군구', '주소', '업종분류', '컨택결과',
    '폐업 날짜', '비고', '종사자수(명) 25년 기준', '24년 매출액(원)', '25년 매출액(원)', '데이터 출처'
  ];
  for (let c = 1; c <= 19; c++) {
    const cell = hRow.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = blackBoldFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }

  let filledRedCells = 0;
  let filledRowsCount = 0;

  // 2. Process Data Rows (2 to 2314)
  for (let r = 2; r <= 2314; r++) {
    const row = ws.getRow(r);
    const origMissing = missingMap[r];
    const verified = masterMap[r];

    // Col 2: 기존행번호 = r (BLACK)
    const c2 = row.getCell(2);
    c2.value = r;
    c2.font = blackRegularFont;

    // Reset all existing cells in this row to clean black regular font first
    for (let c = 1; c <= 19; c++) {
      if (c === 2) continue; // already set
      const cell = row.getCell(c);
      cell.font = blackRegularFont;
    }

    if (verified) {
      filledRowsCount++;

      // Helper to fill newly found values in RED BOLD
      function fillNewRed(colIdx, val) {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const cell = row.getCell(colIdx);
          cell.value = String(val).trim();
          cell.font = {
            name: '맑은 고딕',
            size: 10,
            color: { argb: 'FFFF0000' },
            bold: true
          };
          filledRedCells++;
        }
      }

      // Col 4: 사업자번호 (Originally missing in all 421 rows -> always RED BOLD)
      fillNewRed(4, verified.bizno);

      // Col 5: 설립연도(연도)
      // If origMissing had no year, but verified has year -> RED BOLD
      if (verified.year) {
        if (!origMissing || !origMissing.year || String(origMissing.year).trim() === '') {
          fillNewRed(5, verified.year);
        } else {
          row.getCell(5).value = String(verified.year).trim();
        }
      }

      // Col 6: 설립연도(월)
      if (verified.month) {
        if (!origMissing || !origMissing.month || String(origMissing.month).trim() === '') {
          fillNewRed(6, verified.month);
        } else {
          row.getCell(6).value = String(verified.month).trim();
        }
      }

      // Col 7: 대표자 성함
      if (verified.ceo) {
        if (!origMissing || !origMissing.ceo || String(origMissing.ceo).trim() === '') {
          fillNewRed(7, verified.ceo);
        } else {
          row.getCell(7).value = String(verified.ceo).trim();
        }
      }

      // Col 8: 연락처
      if (verified.tel) {
        if (!origMissing || !origMissing.phone || String(origMissing.phone).trim() === '') {
          fillNewRed(8, verified.tel);
        } else {
          row.getCell(8).value = String(verified.tel).trim();
        }
      }

      // Col 9: 팩스번호
      if (verified.fax) {
        if (!origMissing || !origMissing.fax || String(origMissing.fax).trim() === '') {
          fillNewRed(9, verified.fax);
        } else {
          row.getCell(9).value = String(verified.fax).trim();
        }
      }

      // Col 14: 폐업 날짜
      if (verified.closeDate) {
        fillNewRed(14, verified.closeDate);
      }

      // Col 15: 비고 ('폐업')
      if (verified.status === '폐업자') {
        fillNewRed(15, '폐업');
      }

      // Col 16: 종사자수(명) 25년 기준 (Originally missing in all 421 rows -> always RED BOLD)
      if (verified.emp) {
        fillNewRed(16, verified.emp);
      }

      // Col 17: 24년 매출액(원) - Row 2307 피커스튜디오
      if (r === 2307) {
        fillNewRed(17, '1,920,000');
      }

      // Col 19: 데이터 출처 (New column -> always RED BOLD)
      if (verified.source) {
        fillNewRed(19, verified.source);
      }
    }
  }

  // Remove any ghost rows after 2314
  if (ws.rowCount > 2314) {
    ws.spliceRows(2315, ws.rowCount - 2314);
  }

  // Set freeze pane on row 1
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];

  // Auto filter
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 19 }
  };

  console.log(`\n=== EXECUTION SUMMARY ===`);
  console.log(`Total verified rows updated: ${filledRowsCount}`);
  console.log(`Total newly filled blank cells set to RED BOLD: ${filledRedCells}`);
  console.log(`Total rows: ${ws.rowCount}`);

  // Write directly to target original Excel
  console.log(`\nWriting directly to: ${targetXlsxPath}...`);
  await wb.xlsx.writeFile(targetXlsxPath);
  console.log('SUCCESS: Written directly to target Excel!');

  // Export CSV (UTF-8 BOM)
  const csvRows = [];
  for (let r = 1; r <= 2314; r++) {
    const row = ws.getRow(r);
    const rowVals = [];
    for (let c = 1; c <= 19; c++) {
      let v = row.getCell(c).value;
      if (v === null || v === undefined) v = '';
      else v = String(v).trim();

      if (v.includes(',') || v.includes('"') || v.includes('\n') || v.includes('\r')) {
        v = `"${v.replace(/"/g, '""')}"`;
      }
      rowVals.push(v);
    }
    csvRows.push(rowVals.join(','));
  }
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  fs.writeFileSync(targetCsvPath, csvContent, 'utf8');
  console.log('SUCCESS: Written to target CSV!');
}

execute().catch(console.error);
