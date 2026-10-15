const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterFile = path.join(SCRATCH, 'master_verified_194.json');
const basePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';

const outPath1 = 'C:/Users/lg/Desktop/오늘/인공지능으로찾은거.xlsx';
const outPath2 = 'C:/Users/lg/Desktop/오늘/인공지능으로찾을거.xlsx';
const outCsv = 'C:/Users/lg/Desktop/오늘/인공지능으로찾은거.csv';

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

const colWidths = [12, 10, 26, 18, 11, 8, 12, 18, 18, 10, 42, 15, 10, 12, 8, 14, 18, 18, 42];

async function createMasterIntegrated() {
  console.log('Reading base pristine file...');
  const wbBase = new ExcelJS.Workbook();
  await wbBase.xlsx.readFile(basePath);
  const wsBase = wbBase.worksheets[0];

  const wb = new ExcelJS.Workbook();

  // =========================================================================
  // SHEET 1: 전체 통합 모집단 (2,314행 전수 통합본)
  // =========================================================================
  const ws1 = wb.addWorksheet('전체 통합 모집단 (2314행)');

  // Header
  const hRow1 = ws1.getRow(1);
  for (let c = 1; c <= 19; c++) {
    const cell = hRow1.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = { ...blackBold };
    cell.alignment = centerAlign;
    cell.border = thinBorder;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
  }

  let totalRedCells = 0;
  let integratedRevCount = 0;

  for (let r = 2; r <= 2314; r++) {
    const baseRow = wsBase.getRow(r);
    const newRow = ws1.getRow(r);
    const verified = masterMap[r];

    // Base data copy
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

    newRow.getCell(2).value = r;
    newRow.getCell(2).font = { ...blackFont };

    if (verified) {
      function setRed1(colIdx, val) {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const cell = newRow.getCell(colIdx);
          cell.value = String(val).trim();
          cell.font = { ...redFont };
          totalRedCells++;
        }
      }

      setRed1(4, verified.bizno);
      setRed1(5, verified.year);
      setRed1(6, verified.month);
      setRed1(7, verified.ceo);
      setRed1(8, verified.tel);
      setRed1(9, verified.fax);
      if (verified.closeDate) setRed1(14, verified.closeDate);
      if (verified.status === '폐업자') setRed1(15, '폐업');
      setRed1(16, verified.emp);
      if (verified.sales2024) {
        setRed1(17, verified.sales2024);
        integratedRevCount++;
      }
      setRed1(19, verified.source);
    }
  }

  for (let c = 1; c <= 19; c++) {
    ws1.getColumn(c).width = colWidths[c - 1];
  }
  ws1.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws1.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 19 } };

  // =========================================================================
  // SHEET 2: 인공지능 발굴 192개사 요약
  // =========================================================================
  const ws2 = wb.addWorksheet('인공지능 발굴 192개사');

  const hRow2 = ws2.getRow(1);
  for (let c = 1; c <= 19; c++) {
    const cell = hRow2.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = { ...blackBold };
    cell.alignment = centerAlign;
    cell.border = thinBorder;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6EEF8' } }; // light soft blue
  }

  const sorted = masterList.slice().sort((a, b) => a.rowNumber - b.rowNumber);

  let outRow = 2;
  for (const item of sorted) {
    const r = item.rowNumber;
    const baseRow = wsBase.getRow(r);
    const newRow = ws2.getRow(outRow);

    for (let c = 1; c <= 19; c++) {
      const cell = newRow.getCell(c);
      cell.value = baseRow.getCell(c).value;
      cell.font = { ...blackFont };
      cell.alignment = centerAlign;
      cell.border = thinBorder;
    }

    newRow.getCell(2).value = r;

    function setRed2(col, val) {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        const cell = newRow.getCell(col);
        cell.value = String(val).trim();
        cell.font = { ...redFont };
      }
    }

    setRed2(4, item.bizno);
    setRed2(5, item.year);
    setRed2(6, item.month);
    setRed2(7, item.ceo);
    setRed2(8, item.tel);
    setRed2(9, item.fax);
    if (item.closeDate) setRed2(14, item.closeDate);
    if (item.status === '폐업자') setRed2(15, '폐업');
    setRed2(16, item.emp);
    if (item.sales2024) setRed2(17, item.sales2024);
    setRed2(19, item.source);

    outRow++;
  }

  for (let c = 1; c <= 19; c++) {
    ws2.getColumn(c).width = colWidths[c - 1];
  }
  ws2.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws2.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 19 } };

  // Write Excel files
  console.log(`Writing to: ${outPath1}...`);
  await wb.xlsx.writeFile(outPath1);
  console.log(`Writing to: ${outPath2}...`);
  await wb.xlsx.writeFile(outPath2);

  // Write CSV for Sheet 1
  const csvRows = [];
  for (let r = 1; r <= 2314; r++) {
    const rowObj = ws1.getRow(r);
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
  fs.writeFileSync(outCsv, '\uFEFF' + csvRows.join('\r\n'), 'utf8');
  console.log(`Writing to: ${outCsv}...`);

  console.log('\n=== COMPLETE INTEGRATION SUCCESS ===');
  console.log(`- Sheet 1: 전체 2,314행 통합 (신규 발굴 192개사 + 50개사 매출액 빨간색 반영)`);
  console.log(`- Sheet 2: 인공지능 발굴 192개사 전용 시트`);
  console.log(`- Saved Excel: ${outPath1}`);
  console.log(`- Saved Excel (Alias): ${outPath2}`);
  console.log(`- Saved CSV: ${outCsv}`);
}

createMasterIntegrated().catch(console.error);
