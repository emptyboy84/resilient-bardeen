const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterFile = path.join(SCRATCH, 'master_verified_194.json');

const targetXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const basePristinePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';

const masterList = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
const masterMap = {};
for (const item of masterList) {
  masterMap[item.rowNumber] = item;
}

async function execute() {
  console.log('Reading base file...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(basePristinePath);
  const ws = wb.worksheets[0];

  ws.name = '2026_부산_CT산업_실태조사';

  // 1. Set Headers (only row 1)
  const hRow = ws.getRow(1);
  const headerTitles = [
    '구분', '기존행번호', '사업체명', '사업자번호', '설립연도(연도)', '설립연도(월)',
    '대표자 성함', '연락처', '팩스번호', '시군구', '주소', '업종분류', '컨택결과',
    '폐업 날짜', '비고', '종사자수(명) 25년 기준', '24년 매출액(원)', '25년 매출액(원)', '데이터 출처'
  ];
  for (let c = 1; c <= 19; c++) {
    const cell = hRow.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }

  let filledRedCells = 0;
  let filledRowsCount = 0;

  // 2. ONLY modify verified rows (192 rows), do NOT touch other rows
  for (const item of masterList) {
    const r = item.rowNumber;
    if (r < 2 || r > 2314) continue;
    
    const row = ws.getRow(r);
    filledRowsCount++;

    function setRed(colIdx, val) {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        const cell = row.getCell(colIdx);
        cell.value = String(val).trim();
        cell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
        filledRedCells++;
      }
    }

    // Col 4: 사업자번호
    setRed(4, item.bizno);

    // Col 5: 설립연도(연도)
    setRed(5, item.year);

    // Col 6: 설립연도(월)
    setRed(6, item.month);

    // Col 7: 대표자 성함
    setRed(7, item.ceo);

    // Col 8: 연락처
    setRed(8, item.tel);

    // Col 9: 팩스번호
    setRed(9, item.fax);

    // Col 14: 폐업 날짜
    if (item.closeDate) {
      setRed(14, item.closeDate);
    }

    // Col 15: 비고
    if (item.status === '폐업자') {
      setRed(15, '폐업');
    }

    // Col 16: 종사자수
    setRed(16, item.emp);

    // Col 17: 매출액 (row 2307)
    if (r === 2307) {
      setRed(17, '1,920,000');
    }

    // Col 19: 데이터 출처
    setRed(19, item.source);
  }

  // Freeze + filter
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 19 }
  };

  console.log(`\n=== EXECUTION SUMMARY ===`);
  console.log(`Total verified rows updated: ${filledRowsCount}`);
  console.log(`Total RED BOLD cells set: ${filledRedCells}`);

  console.log(`\nWriting to: ${targetXlsxPath}...`);
  await wb.xlsx.writeFile(targetXlsxPath);
  console.log('Excel written!');

  // CSV export
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
  fs.writeFileSync(targetCsvPath, '\uFEFF' + csvRows.join('\r\n'), 'utf8');
  console.log('CSV written!');

  // === VERIFICATION PASS ===
  console.log('\n=== VERIFICATION (re-read from file) ===');
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(targetXlsxPath);
  const ws2 = wb2.worksheets[0];

  let totalRedInFile = 0;
  const redRowSummary = {};

  for (let r = 2; r <= 2314; r++) {
    const rowObj = ws2.getRow(r);
    let rowRedCols = [];
    for (let c = 1; c <= 19; c++) {
      const cell = rowObj.getCell(c);
      const argb = cell.font && cell.font.color && cell.font.color.argb;
      if (argb && (argb.toUpperCase() === 'FFFF0000' || argb.toUpperCase() === 'FF0000')) {
        totalRedInFile++;
        rowRedCols.push(c);
      }
    }
    if (rowRedCols.length > 0) {
      redRowSummary[r] = rowRedCols;
    }
  }

  const totalRedRows = Object.keys(redRowSummary).length;
  console.log(`Total RED cells in output: ${totalRedInFile}`);
  console.log(`Expected RED cells: ${filledRedCells}`);
  console.log(`RED rows: ${totalRedRows}`);
  console.log(`Match: ${totalRedInFile >= filledRedCells ? 'YES ✓' : 'NO ✗'}`);

  // Show first 5 and last 5 red rows
  const redRows = Object.keys(redRowSummary).map(Number).sort((a, b) => a - b);
  console.log('\nFirst 5 red rows:');
  for (const r of redRows.slice(0, 5)) {
    console.log(`  Row ${r}: cols ${redRowSummary[r].join(',')}`);
  }
  console.log('Last 5 red rows:');
  for (const r of redRows.slice(-5)) {
    console.log(`  Row ${r}: cols ${redRowSummary[r].join(',')}`);
  }

  // Detailed check on row 639
  console.log('\n--- Row 639 detailed ---');
  const r639 = ws2.getRow(639);
  for (let c = 1; c <= 19; c++) {
    const cell = r639.getCell(c);
    const argb = cell.font && cell.font.color && cell.font.color.argb;
    if (cell.value) {
      console.log(`  Col ${c}: "${cell.value}" argb=${argb} bold=${cell.font && cell.font.bold}`);
    }
  }
}

execute().catch(console.error);
