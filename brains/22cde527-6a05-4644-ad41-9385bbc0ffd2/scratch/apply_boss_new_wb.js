const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterFile = path.join(SCRATCH, 'master_verified_194.json');
const missingFile = path.join(SCRATCH, 'missing_421.json');

const targetXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const basePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';

const masterList = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
const masterMap = {};
for (const item of masterList) masterMap[item.rowNumber] = item;

const missingList = JSON.parse(fs.readFileSync(missingFile, 'utf8'));
const missingSet = new Set(missingList.map(m => m.rowNumber));

async function execute() {
  console.log('Reading base file...');
  const wbBase = new ExcelJS.Workbook();
  await wbBase.xlsx.readFile(basePath);
  const wsBase = wbBase.worksheets[0];

  console.log('Creating new workbook...');
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('2026_부산_CT산업_실태조사');

  const headerTitles = [
    '구분', '기존행번호', '사업체명', '사업자번호', '설립연도(연도)', '설립연도(월)',
    '대표자 성함', '연락처', '팩스번호', '시군구', '주소', '업종분류', '컨택결과',
    '폐업 날짜', '비고', '종사자수(명) 25년 기준', '24년 매출액(원)', '25년 매출액(원)', '데이터 출처'
  ];

  // Column widths from base file
  for (let c = 1; c <= 19; c++) {
    const baseCol = wsBase.getColumn(c);
    ws.getColumn(c).width = baseCol.width || 12;
  }

  // Header row
  const hRow = ws.getRow(1);
  for (let c = 1; c <= 19; c++) {
    const cell = hRow.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      left: { style: 'thin', color: { argb: 'FFE8E8E8' } },
      right: { style: 'thin', color: { argb: 'FFE8E8E8' } },
      top: { style: 'thin', color: { argb: 'FFE8E8E8' } },
      bottom: { style: 'thin', color: { argb: 'FFE8E8E8' } }
    };
  }

  let filledRedCells = 0;
  let filledRowsCount = 0;

  const blackFont = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: false };
  const redFont = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  const thinBorder = {
    left: { style: 'thin', color: { argb: 'FFE8E8E8' } },
    right: { style: 'thin', color: { argb: 'FFE8E8E8' } },
    top: { style: 'thin', color: { argb: 'FFE8E8E8' } },
    bottom: { style: 'thin', color: { argb: 'FFE8E8E8' } }
  };
  const centerAlign = { vertical: 'middle', horizontal: 'center' };

  for (let r = 2; r <= 2314; r++) {
    const baseRow = wsBase.getRow(r);
    const newRow = ws.getRow(r);
    const verified = masterMap[r];
    const wasMissing = missingSet.has(r);

    // Copy all 19 columns from base
    for (let c = 1; c <= 19; c++) {
      const baseCell = baseRow.getCell(c);
      const newCell = newRow.getCell(c);
      
      // Copy value
      newCell.value = baseCell.value;
      
      // Check if this cell was originally red in the base
      const baseArgb = baseCell.font && baseCell.font.color && baseCell.font.color.argb;
      const wasRed = baseArgb && baseArgb.toUpperCase() === 'FFFF0000';
      
      // Set font: preserve red from base, otherwise black
      if (wasRed) {
        newCell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
      } else {
        newCell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: false };
      }
      
      // Copy border and alignment
      newCell.border = thinBorder;
      newCell.alignment = centerAlign;
    }

    // Override with verified data (RED BOLD for new data)
    if (verified) {
      filledRowsCount++;

      function setRed(colIdx, val) {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const cell = newRow.getCell(colIdx);
          cell.value = String(val).trim();
          cell.font = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
          filledRedCells++;
        }
      }

      setRed(4, verified.bizno);
      setRed(5, verified.year);
      setRed(6, verified.month);
      setRed(7, verified.ceo);
      setRed(8, verified.tel);
      setRed(9, verified.fax);
      if (verified.closeDate) setRed(14, verified.closeDate);
      if (verified.status === '폐업자') setRed(15, '폐업');
      setRed(16, verified.emp);
      if (r === 2307) setRed(17, '1,920,000');
      setRed(19, verified.source);
    }

    // Set row 2 column (기존행번호)
    newRow.getCell(2).value = r;
    newRow.getCell(2).font = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: false };
  }

  // Freeze + filter
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 19 } };

  console.log(`\n=== EXECUTION SUMMARY ===`);
  console.log(`Total verified rows: ${filledRowsCount}`);
  console.log(`Total NEW RED cells: ${filledRedCells}`);

  console.log(`\nWriting to: ${targetXlsxPath}...`);
  await wb.xlsx.writeFile(targetXlsxPath);
  console.log('Excel written!');

  // CSV
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

  // === VERIFICATION ===
  console.log('\n=== VERIFICATION ===');
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(targetXlsxPath);
  const ws2 = wb2.worksheets[0];

  let totalRed = 0;
  let totalBlack = 0;
  
  // Check non-verified row (row 100)
  const r100font = ws2.getRow(100).getCell(1).font;
  console.log(`Row 100 Col 1 font: ${JSON.stringify(r100font)}`);
  
  for (let r = 2; r <= 2314; r++) {
    for (let c = 1; c <= 19; c++) {
      const cell = ws2.getRow(r).getCell(c);
      const argb = cell.font && cell.font.color && cell.font.color.argb;
      if (argb && argb.toUpperCase() === 'FFFF0000') totalRed++;
      else totalBlack++;
    }
  }

  const expectedRed = 2180 + filledRedCells; // base reds + new reds (some overlap on col 4)
  console.log(`Total RED cells: ${totalRed}`);
  console.log(`Total non-RED cells: ${totalBlack}`);
  console.log(`Expected approx RED: ~${expectedRed} (base 2180 + new ${filledRedCells}, minus overlaps)`);

  // Check verified rows
  let okRows = 0;
  for (const item of masterList) {
    const row = ws2.getRow(item.rowNumber);
    const c4argb = row.getCell(4).font && row.getCell(4).font.color && row.getCell(4).font.color.argb;
    if (c4argb && c4argb.toUpperCase() === 'FFFF0000') okRows++;
  }
  console.log(`Verified rows with RED bizno: ${okRows}/${masterList.length}`);

  // Sample check
  console.log('\nRow 639 details:');
  for (let c = 1; c <= 19; c++) {
    const cell = ws2.getRow(639).getCell(c);
    const argb = cell.font && cell.font.color && cell.font.color.argb;
    if (cell.value) console.log(`  Col ${c}: "${cell.value}" ${argb === 'FFFF0000' ? 'RED' : 'BLK'}`);
  }
}

execute().catch(console.error);
