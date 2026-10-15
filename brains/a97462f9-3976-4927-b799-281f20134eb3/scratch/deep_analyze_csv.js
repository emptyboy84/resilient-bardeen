const fs = require('fs');

// Robust CSV parser supporting multiline fields
function parseFullCSV(content) {
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
      if (currentRow.some(f => f.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) {
      rows.push(currentRow);
    }
  }
  return rows;
}

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const parsed = parseFullCSV(content);

const header = parsed[0];
const dataRows = parsed.slice(1);

console.log('Header length:', header.length);
console.log('Header columns:', header);
console.log('Total data rows:', dataRows.length);

let emptyBizCount = 0;
let hasBizCount = 0;
let emptySales24 = 0;
let hasSales24 = 0;
let emptySales25 = 0;
let hasSales25 = 0;

// Indices
// 0: 구분, 1: 순번, 2: 사업체명, 3: 사업자번호, 4: 설립연도(연도), 5: 설립연도(월), 6: 대표자 성함, 7: 연락처, 8: 팩스번호, 9: 시군구, 10: 주소, 11: 업종분류, 12: 컨택결과, 13: 폐업 날짜, 14: 비고, 15: 종사자수(명) 25년 기준, 16: 24년 매출액(원), 17: 25년 매출액(원)
const candidatesForSales = [];
const missingBizRows = [];

dataRows.forEach((r, idx) => {
  const rowNum = idx + 2; // Excel 1-based row
  const seq = r[1];
  const name = r[2];
  const biz = r[3] ? r[3].trim() : '';
  const s24 = r[16] ? r[16].trim() : '';
  const s25 = r[17] ? r[17].trim() : '';
  const closed = (r[13] || '') + (r[14] || '');

  if (!biz) {
    emptyBizCount++;
    missingBizRows.push({ rowNum, seq, name, r });
  } else {
    hasBizCount++;
    if (!s24 && !s25 && !closed.includes('폐업')) {
      candidatesForSales.push({ rowNum, seq, name, biz, r });
    }
  }

  if (s24) hasSales24++; else emptySales24++;
  if (s25) hasSales25++; else emptySales25++;
});

console.log('Has Biz:', hasBizCount, 'Empty Biz:', emptyBizCount);
console.log('Has Sales 24:', hasSales24, 'Empty Sales 24:', emptySales24);
console.log('Has Sales 25:', hasSales25, 'Empty Sales 25:', emptySales25);
console.log('Active companies with Biz but NO Sales:', candidatesForSales.length);
console.log('Missing Biz Rows count:', missingBizRows.length);
console.log('First 5 missing biz:', missingBizRows.slice(0, 5).map(m => ({ rowNum: m.rowNum, name: m.name })));
