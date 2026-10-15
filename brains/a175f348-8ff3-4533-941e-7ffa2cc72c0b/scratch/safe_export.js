const fs = require('fs');
const path = require('path');
const ExcelJS = require('c:/Users/lg/resilient-bardeen/node_modules/exceljs');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

async function exportExcel() {
  const originalPath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_backup.csv';
  const updatedPath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
  const outputXlsx = 'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_16컬럼_주황색마킹_최종검증.xlsx';
  const outputXlsxLatest = 'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_16컬럼_주황색마킹_최종검증_최신.xlsx';
  const outputHtml = 'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_16컬럼_주황색마킹_최종검증.html';

  const origLines = fs.readFileSync(originalPath, 'utf8').split(/\r?\n/);
  const updatedLines = fs.readFileSync(updatedPath, 'utf8').split(/\r?\n/);

  const colDefinitions = [
    { key: 'note', colIdx: 1, title: '비고', width: 12 },
    { key: 'company', colIdx: 2, title: '회사명', width: 25 },
    { key: 'bizNo', colIdx: 3, title: '사업자번호', width: 15 },
    { key: 'rep', colIdx: 4, title: '대표자', width: 12 },
    { key: 'zip', colIdx: 5, title: '우편번호', width: 10 },
    { key: 'addr', colIdx: 6, title: '주소', width: 45 },
    { key: 'phone', colIdx: 7, title: '전화번호', width: 16 },
    { key: 'fax', colIdx: 8, title: '팩스번호', width: 16 },
    { key: 'hp', colIdx: 9, title: '홈페이지', width: 25 },
    { key: 'email', colIdx: 10, title: '이메일', width: 22 },
    { key: 'emp', colIdx: 14, title: '종업원수', width: 12 },
    { key: 'nice', colIdx: 17, title: '업종(NICE BizINFO(업종)참고)', width: 30 },
    { key: 'corpNo', colIdx: 24, title: '법인번호', width: 18 },
    { key: 'closing', colIdx: 30, title: '결산월', width: 10 },
    { key: 'dae', colIdx: 47, title: '업종_대', width: 22 },
    { key: 'jung', colIdx: 48, title: '업종_중', width: 25 },
    { key: 'so', colIdx: 49, title: '업종_소', width: 30 }
  ];

  const bhmRows = [];
  let seq = 0;

  for (let i = 1; i < updatedLines.length; i++) {
    if (!updatedLines[i].trim()) continue;
    const updCols = parseCSVLine(updatedLines[i]);
    if (updCols[0] === '배현명') {
      seq++;
      const origCols = i < origLines.length && origLines[i].trim() ? parseCSVLine(origLines[i]) : [];

      const lineNum = i + 1;
      const rowItem = { seq, lineNum, cells: [] };

      colDefinitions.forEach(col => {
        const origVal = (origCols[col.colIdx] || '').trim();
        const updVal = (updCols[col.colIdx] || '').trim();

        let isChanged = false;
        if (!origVal && updVal) isChanged = true;
        else if (origVal && updVal && origVal !== updVal) isChanged = true;

        rowItem.cells.push({
          key: col.key,
          title: col.title,
          colIdx: col.colIdx,
          val: updVal,
          isChanged
        });
      });

      bhmRows.push(rowItem);
    }
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('배현명_검증완료');

  worksheet.columns = [
    { header: 'No', key: 'seq', width: 8 },
    { header: '원본행', key: 'lineNum', width: 10 },
    ...colDefinitions.map(c => ({ header: c.title, key: c.key, width: c.width }))
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
    cell.font = { name: '맑은 고딕', bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  const niceHeaderCell = headerRow.getCell(14);
  if (niceHeaderCell) {
    niceHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB3B' } };
    niceHeaderCell.font = { name: '맑은 고딕', bold: true, color: { argb: 'FF000000' }, size: 11 };
  }

  bhmRows.forEach(rowItem => {
    const rowValues = { seq: rowItem.seq, lineNum: rowItem.lineNum };
    rowItem.cells.forEach(c => { rowValues[c.key] = c.val; });

    const excelRow = worksheet.addRow(rowValues);
    excelRow.height = 20;

    rowItem.cells.forEach((c, idx) => {
      const cell = excelRow.getCell(idx + 3);
      cell.font = { name: '맑은 고딕', size: 10 };
      cell.alignment = { vertical: 'middle' };

      if (c.key === 'bizNo' || c.key === 'zip' || c.key === 'corpNo' || c.key === 'closing' || c.key === 'emp' || c.key === 'note') {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }

      if (c.isChanged) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC000' } };
        cell.font = { name: '맑은 고딕', bold: true, color: { argb: 'FF803000' }, size: 10 };
      }

      if (c.key === 'note' && c.val === '폐업') {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCDD2' } };
        cell.font = { name: '맑은 고딕', bold: true, color: { argb: 'FFB71C1C' }, size: 10 };
      }
    });
  });

  try {
    await workbook.xlsx.writeFile(outputXlsx);
    console.log(`Saved: ${outputXlsx}`);
  } catch (err) {
    console.log(`Main excel locked, saving to: ${outputXlsxLatest}`);
    await workbook.xlsx.writeFile(outputXlsxLatest);
  }
}

exportExcel().catch(console.error);
