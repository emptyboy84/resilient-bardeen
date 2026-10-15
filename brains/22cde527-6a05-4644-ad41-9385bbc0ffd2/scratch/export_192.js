const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterList = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'master_verified_194.json'), 'utf8'));
const masterMap = {};
for (const item of masterList) masterMap[item.rowNumber] = item;

const basePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';
const outPath = 'C:/Users/lg/Desktop/오늘/사업자번호_찾은_192개.xlsx';

async function execute() {
  const wbBase = new ExcelJS.Workbook();
  await wbBase.xlsx.readFile(basePath);
  const wsBase = wbBase.worksheets[0];

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('찾은 192개');

  const headers = [
    '구분', '기존행번호', '사업체명', '사업자번호', '설립연도(연도)', '설립연도(월)',
    '대표자 성함', '연락처', '팩스번호', '시군구', '주소', '업종분류', '컨택결과',
    '폐업 날짜', '비고', '종사자수(명) 25년 기준', '24년 매출액(원)', '25년 매출액(원)', '데이터 출처'
  ];

  const blackFont = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: false };
  const blackBold = { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' }, bold: true };
  const redFont = { name: '맑은 고딕', size: 10, color: { argb: 'FFFF0000' }, bold: true };
  const border = {
    left: { style: 'thin', color: { argb: 'FFE8E8E8' } },
    right: { style: 'thin', color: { argb: 'FFE8E8E8' } },
    top: { style: 'thin', color: { argb: 'FFE8E8E8' } },
    bottom: { style: 'thin', color: { argb: 'FFE8E8E8' } }
  };
  const center = { vertical: 'middle', horizontal: 'center' };

  // Header
  const hRow = ws.getRow(1);
  for (let c = 1; c <= 19; c++) {
    const cell = hRow.getCell(c);
    cell.value = headers[c - 1];
    cell.font = { ...blackBold };
    cell.alignment = center;
    cell.border = border;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
  }

  // Sort by row number
  const sorted = masterList.slice().sort((a, b) => a.rowNumber - b.rowNumber);

  let outRow = 2;
  for (const item of sorted) {
    const r = item.rowNumber;
    const baseRow = wsBase.getRow(r);
    const newRow = ws.getRow(outRow);

    // Copy base data first (all black)
    for (let c = 1; c <= 19; c++) {
      const cell = newRow.getCell(c);
      cell.value = baseRow.getCell(c).value;
      cell.font = { ...blackFont };
      cell.alignment = center;
      cell.border = border;
    }

    // Row number
    newRow.getCell(2).value = r;

    // Apply verified red data
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
  ws.getColumn(17).width = 15;
  ws.getColumn(18).width = 15;
  ws.getColumn(19).width = 40;

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 19 } };

  await wb.xlsx.writeFile(outPath);
  console.log(`완료! ${sorted.length}행 저장됨: ${outPath}`);
}

execute().catch(console.error);
