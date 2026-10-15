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

const RED_BOLD = {
  name: '맑은 고딕',
  size: 10,
  color: { argb: 'FFFF0000' },
  bold: true
};

const BLACK_REG = {
  name: '맑은 고딕',
  size: 10,
  color: { argb: 'FF000000' },
  bold: false
};

const BLACK_BOLD = {
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

  ws.name = '2026_부산_CT산업_실태조사';

  // 1. Header Row
  const hRow = ws.getRow(1);
  const headerTitles = [
    '구분', '기존행번호', '사업체명', '사업자번호', '설립연도(연도)', '설립연도(월)',
    '대표자 성함', '연락처', '팩스번호', '시군구', '주소', '업종분류', '컨택결과',
    '폐업 날짜', '비고', '종사자수(명) 25년 기준', '24년 매출액(원)', '25년 매출액(원)', '데이터 출처'
  ];
  for (let c = 1; c <= 19; c++) {
    const cell = hRow.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = { ...BLACK_BOLD };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }

  let filledRedCells = 0;
  let filledRowsCount = 0;

  // 2. Process Data Rows
  for (let r = 2; r <= 2314; r++) {
    const row = ws.getRow(r);
    const verified = masterMap[r];

    // Col 2: always black
    row.getCell(2).value = r;
    row.getCell(2).font = { ...BLACK_REG };

    if (!verified) {
      // Non-verified row: just ensure clean black font
      for (let c = 1; c <= 19; c++) {
        if (c === 2) continue;
        row.getCell(c).font = { ...BLACK_REG };
      }
      continue;
    }

    // === VERIFIED ROW ===
    filledRowsCount++;

    // For verified rows, we set each cell's font EXACTLY ONCE.
    // Columns that get new data -> RED BOLD
    // Columns that keep original data -> BLACK REG

    // Track which columns we set to RED so the rest get BLACK
    const redCols = new Set();

    function setRed(colIdx, val) {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        const cell = row.getCell(colIdx);
        cell.value = String(val).trim();
        cell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
        redCols.add(colIdx);
        filledRedCells++;
      }
    }

    // Col 4: 사업자번호 - always RED (was missing for all 421)
    setRed(4, verified.bizno);

    // Col 5: 설립연도(연도)
    if (verified.year) {
      setRed(5, verified.year);
    }

    // Col 6: 설립연도(월)
    if (verified.month) {
      setRed(6, verified.month);
    }

    // Col 7: 대표자 성함
    if (verified.ceo) {
      setRed(7, verified.ceo);
    }

    // Col 8: 연락처
    if (verified.tel) {
      setRed(8, verified.tel);
    }

    // Col 9: 팩스번호
    if (verified.fax) {
      setRed(9, verified.fax);
    }

    // Col 14: 폐업 날짜
    if (verified.closeDate) {
      setRed(14, verified.closeDate);
    }

    // Col 15: 비고
    if (verified.status === '폐업자') {
      setRed(15, '폐업');
    }

    // Col 16: 종사자수
    if (verified.emp) {
      setRed(16, verified.emp);
    }

    // Col 17: 매출액 (row 2307 only)
    if (r === 2307) {
      setRed(17, '1,920,000');
    }

    // Col 19: 데이터 출처
    if (verified.source) {
      setRed(19, verified.source);
    }

    // Now set BLACK on all remaining columns that were NOT set to RED
    for (let c = 1; c <= 19; c++) {
      if (c === 2) continue; // already set
      if (redCols.has(c)) continue; // already set to RED
      row.getCell(c).font = { ...BLACK_REG };
    }

    // Commit row
    row.commit();
  }

  // Remove ghost rows
  if (ws.rowCount > 2314) {
    ws.spliceRows(2315, ws.rowCount - 2314);
  }

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 19 }
  };

  console.log(`\n=== EXECUTION SUMMARY ===`);
  console.log(`Total verified rows updated: ${filledRowsCount}`);
  console.log(`Total RED BOLD cells: ${filledRedCells}`);

  console.log(`\nWriting to: ${targetXlsxPath}...`);
  await wb.xlsx.writeFile(targetXlsxPath);
  console.log('SUCCESS: Excel written!');

  // Export CSV
  const csvRows = [];
  for (let r = 1; r <= 2314; r++) {
    const rowObj = ws.getRow(r);
    const rowVals = [];
    for (let c = 1; c <= 19; c++) {
      let v = rowObj.getCell(c).value;
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
  console.log('SUCCESS: CSV written!');

  // === VERIFICATION PASS ===
  console.log('\n=== VERIFICATION ===');
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(targetXlsxPath);
  const ws2 = wb2.worksheets[0];
  
  let totalRedInFile = 0;
  const sampleRedRows = [];
  
  for (let r = 2; r <= 2314; r++) {
    const rowObj = ws2.getRow(r);
    let rowRedCount = 0;
    const redColsInRow = [];
    for (let c = 1; c <= 19; c++) {
      const cell = rowObj.getCell(c);
      const argb = cell.font && cell.font.color && cell.font.color.argb;
      if (argb === 'FFFF0000' || argb === 'ffff0000' || argb === 'FF0000') {
        rowRedCount++;
        totalRedInFile++;
        redColsInRow.push(c);
      }
    }
    if (rowRedCount > 0 && sampleRedRows.length < 5) {
      sampleRedRows.push({ row: r, redCount: rowRedCount, redCols: redColsInRow });
    }
  }
  
  console.log(`Total RED cells in output file: ${totalRedInFile}`);
  console.log(`Expected RED cells: ${filledRedCells}`);
  console.log(`Match: ${totalRedInFile === filledRedCells ? 'YES ✓' : 'NO ✗ (MISMATCH!)'}`);
  console.log('Sample red rows:', JSON.stringify(sampleRedRows, null, 2));
}

execute().catch(console.error);
