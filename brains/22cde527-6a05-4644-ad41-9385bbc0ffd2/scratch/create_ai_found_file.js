const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterFile = path.join(SCRATCH, 'master_verified_194.json');
const basePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';

const outPathFound = 'C:/Users/lg/Desktop/오늘/인공지능으로찾은거.xlsx';
const outPathTypo = 'C:/Users/lg/Desktop/오늘/인공지능으로찾을거.xlsx';

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

async function createAiFoundFile() {
  console.log('Reading base pristine file...');
  const wbBase = new ExcelJS.Workbook();
  await wbBase.xlsx.readFile(basePath);
  const wsBase = wbBase.worksheets[0];

  const wb = new ExcelJS.Workbook();

  // ==========================================
  // SHEET 1: 인공지능으로 찾은 192개
  // ==========================================
  const ws1 = wb.addWorksheet('인공지능 발굴 192개사');

  // Headers
  const hRow1 = ws1.getRow(1);
  for (let c = 1; c <= 19; c++) {
    const cell = hRow1.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = { ...blackBold };
    cell.alignment = centerAlign;
    cell.border = thinBorder;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
  }

  const sorted = masterList.slice().sort((a, b) => a.rowNumber - b.rowNumber);

  let outRow = 2;
  for (const item of sorted) {
    const r = item.rowNumber;
    const baseRow = wsBase.getRow(r);
    const newRow = ws1.getRow(outRow);

    for (let c = 1; c <= 19; c++) {
      const cell = newRow.getCell(c);
      cell.value = baseRow.getCell(c).value;
      cell.font = { ...blackFont };
      cell.alignment = centerAlign;
      cell.border = thinBorder;
    }

    newRow.getCell(2).value = r;

    function setRed1(col, val) {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        const cell = newRow.getCell(col);
        cell.value = String(val).trim();
        cell.font = { ...redFont };
      }
    }

    setRed1(4, item.bizno);
    setRed1(5, item.year);
    setRed1(6, item.month);
    setRed1(7, item.ceo);
    setRed1(8, item.tel);
    setRed1(9, item.fax);
    if (item.closeDate) setRed1(14, item.closeDate);
    if (item.status === '폐업자') setRed1(15, '폐업');
    setRed1(16, item.emp);
    if (item.sales2024) setRed1(17, item.sales2024);
    setRed1(19, item.source);

    outRow++;
  }

  const widths = [12, 10, 25, 18, 10, 8, 12, 18, 18, 10, 40, 15, 10, 12, 8, 14, 18, 18, 40];
  for (let c = 1; c <= 19; c++) {
    ws1.getColumn(c).width = widths[c - 1];
  }
  ws1.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws1.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 19 } };

  // ==========================================
  // SHEET 2: 전체 모집단 (2,314행 통합본)
  // ==========================================
  const ws2 = wb.addWorksheet('전체 모집단 현행화(2314행)');

  const hRow2 = ws2.getRow(1);
  for (let c = 1; c <= 19; c++) {
    const cell = hRow2.getCell(c);
    cell.value = headerTitles[c - 1];
    cell.font = { ...blackBold };
    cell.alignment = centerAlign;
    cell.border = thinBorder;
  }

  for (let r = 2; r <= 2314; r++) {
    const baseRow = wsBase.getRow(r);
    const newRow = ws2.getRow(r);
    const verified = masterMap[r];

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
      function setRed2(colIdx, val) {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const cell = newRow.getCell(colIdx);
          cell.value = String(val).trim();
          cell.font = { ...redFont };
        }
      }

      setRed2(4, verified.bizno);
      setRed2(5, verified.year);
      setRed2(6, verified.month);
      setRed2(7, verified.ceo);
      setRed2(8, verified.tel);
      setRed2(9, verified.fax);
      if (verified.closeDate) setRed2(14, verified.closeDate);
      if (verified.status === '폐업자') setRed2(15, '폐업');
      setRed2(16, verified.emp);
      if (verified.sales2024) setRed2(17, verified.sales2024);
      setRed2(19, verified.source);
    }
  }

  for (let c = 1; c <= 19; c++) {
    ws2.getColumn(c).width = widths[c - 1];
  }
  ws2.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws2.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 19 } };

  console.log(`Writing to: ${outPathFound}...`);
  await wb.xlsx.writeFile(outPathFound);
  console.log(`Writing to: ${outPathTypo}...`);
  await wb.xlsx.writeFile(outPathTypo);
  console.log('SUCCESS: All files written!');
}

createAiFoundFile().catch(console.error);
