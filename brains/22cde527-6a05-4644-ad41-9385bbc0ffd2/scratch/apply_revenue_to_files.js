const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterFile = path.join(SCRATCH, 'master_verified_194.json');
const basePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';

const targetXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const export192Path = 'C:/Users/lg/Desktop/오늘/사업자번호_찾은_192개.xlsx';

const masterList = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
const masterMap = {};
for (const item of masterList) masterMap[item.rowNumber] = item;

const blackFont = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: false };
const blackBold = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: true };
const redFont = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
const thinBorder = {
  left: { style: 'thin', color: { argb: 'FFE8E8E8' } },
  right: { style: 'thin', color: { argb: 'FFE8E8E8' } },
  top: { style: 'thin', color: { argb: 'FFE8E8E8' } },
  bottom: { style: 'thin', color: { argb: 'FFE8E8E8' } }
};
const centerAlign = { vertical: 'middle', horizontal: 'center' };

const headerTitles = [
  '구분', '기존행번호', '사업체명', '사업자번호', '설립연도(연도)', '설립연도(월)',
  '대표자 성함', '연락처', '팩스번호', '시군구', '주소', '업종분류', '컨택결과',
  '폐업 날짜', '비고', '종사자수(명) 25년 기준', '24년 매출액(원)', '25년 매출액(원)', '데이터 출처'
];

async function updateFullDeliverable() {
  console.log('Reading base pristine file...');
  const wbBase = new ExcelJS.Workbook();
  await wbBase.xlsx.readFile(basePath);
  const wsBase = wbBase.worksheets[0];

  console.log('Creating clean full deliverable workbook...');
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('2026_부산_CT산업_실태조사');

  // Column widths
  for (let c = 1; c <= 19; c++) {
    const baseCol = wsBase.getColumn(c);
    ws.getColumn(c).width = baseCol.width || 12;
  }

  // Header row
  const hRow = ws.getRow(1);
  for (let c = 1; c <= 19; c++) {
    const cell = hRow.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = { ...blackBold };
    cell.alignment = centerAlign;
    cell.border = thinBorder;
  }

  let filledRedCells = 0;
  let revenueCount = 0;

  for (let r = 2; r <= 2314; r++) {
    const baseRow = wsBase.getRow(r);
    const newRow = ws.getRow(r);
    const verified = masterMap[r];

    // Copy base data
    for (let c = 1; c <= 19; c++) {
      const baseCell = baseRow.getCell(c);
      const newCell = newRow.getCell(c);
      newCell.value = baseCell.value;

      const baseArgb = baseCell.font && baseCell.font.color && baseCell.font.color.argb;
      const wasRed = baseArgb && baseArgb.toUpperCase() === 'FFFF0000';

      if (wasRed) {
        newCell.font = { ...redFont };
      } else {
        newCell.font = { ...blackFont };
      }
      newCell.border = thinBorder;
      newCell.alignment = centerAlign;
    }

    // Set row 2: 기존행번호
    newRow.getCell(2).value = r;
    newRow.getCell(2).font = { ...blackFont };

    // Apply verified data
    if (verified) {
      function setRed(colIdx, val) {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const cell = newRow.getCell(colIdx);
          cell.value = String(val).trim();
          cell.font = { ...redFont };
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

      // Col 17: 24년 매출액(원)
      if (verified.sales2024) {
        setRed(17, verified.sales2024);
        revenueCount++;
      }

      setRed(19, verified.source);
    }
  }

  // Freeze & filter
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 19 } };

  console.log(`Writing full Excel to ${targetXlsxPath}...`);
  await wb.xlsx.writeFile(targetXlsxPath);
  console.log(`Full Excel written! Total revenue fields filled: ${revenueCount}`);

  // Write CSV
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
  console.log(`CSV written!`);
}

async function update192Export() {
  console.log('Creating clean 192 export workbook...');
  const wbBase = new ExcelJS.Workbook();
  await wbBase.xlsx.readFile(basePath);
  const wsBase = wbBase.worksheets[0];

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('찾은 192개');

  // Header
  const hRow = ws.getRow(1);
  for (let c = 1; c <= 19; c++) {
    const cell = hRow.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = { ...blackBold };
    cell.alignment = centerAlign;
    cell.border = thinBorder;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
  }

  const sorted = masterList.slice().sort((a, b) => a.rowNumber - b.rowNumber);

  let outRow = 2;
  let revCount192 = 0;
  for (const item of sorted) {
    const r = item.rowNumber;
    const baseRow = wsBase.getRow(r);
    const newRow = ws.getRow(outRow);

    for (let c = 1; c <= 19; c++) {
      const cell = newRow.getCell(c);
      cell.value = baseRow.getCell(c).value;
      cell.font = { ...blackFont };
      cell.alignment = centerAlign;
      cell.border = thinBorder;
    }

    newRow.getCell(2).value = r;

    function setRed(col, val) {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        const cell = newRow.getCell(col);
        cell.value = String(val).trim();
        cell.font = { ...redFont };
      }
    }

    setRed(4, item.bizno);
    setRed(5, item.year);
    setRed(6, item.month);
    setRed(7, item.ceo);
    setRed(8, item.tel);
    setRed(9, item.fax);
    if (item.closeDate) setRed(14, item.closeDate);
    if (item.status === '폐업자') setRed(15, '폐업');
    setRed(16, item.emp);
    if (item.sales2024) {
      setRed(17, item.sales2024);
      revCount192++;
    }
    setRed(19, item.source);

    outRow++;
  }

  // Column widths
  ws.getColumn(1).width = 12;
  ws.getColumn(2).width = 10;
  ws.getColumn(3).width = 25;
  ws.getColumn(4).width = 18;
  ws.getColumn(5).width = 10;
  ws.getColumn(6).width = 8;
  ws.getColumn(7).width = 12;
  ws.getColumn(8).width = 18;
  ws.getColumn(9).width = 18;
  ws.getColumn(10).width = 10;
  ws.getColumn(11).width = 40;
  ws.getColumn(12).width = 15;
  ws.getColumn(13).width = 10;
  ws.getColumn(14).width = 12;
  ws.getColumn(15).width = 8;
  ws.getColumn(16).width = 12;
  ws.getColumn(17).width = 18; // 24년 매출액
  ws.getColumn(18).width = 18; // 25년 매출액
  ws.getColumn(19).width = 40;

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 19 } };

  console.log(`Writing 192 export to ${export192Path}...`);
  await wb.xlsx.writeFile(export192Path);
  console.log(`192 export written! Total revenue fields filled: ${revCount192}`);
}

async function main() {
  await updateFullDeliverable();
  await update192Export();
  console.log('\n=== ALL FILES SUCCESSFULLY UPDATED WITH REVENUE DATA! ===');
}

main().catch(console.error);
