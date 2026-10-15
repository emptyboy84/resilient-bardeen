const fs = require('fs');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  const header = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const obj = {};
    header.forEach((h, idx) => {
      obj[h] = vals[idx] !== undefined ? vals[idx] : '';
    });
    obj._lineNum = i + 1;
    rows.push(obj);
  }
  return { header, rows };
}

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const { header, rows } = parseCSV(content);

console.log('Headers:', header);
console.log('Total rows:', rows.length);

let emptyBiz = 0;
let hasSales24 = 0;
let hasSales25 = 0;
let hasEmp = 0;
let closedCount = 0;

const sampleSales = [];
const emptyBizList = [];

rows.forEach(r => {
  const biz = r['사업자번호'];
  const s24 = r['24년 매출액(원)'];
  const s25 = r['25년 매출액(원)'];
  const emp = r['종사자수(명) 25년 기준'];
  const closed = r['폐업 날짜'] || r['비고'];

  if (!biz || biz === '') {
    emptyBiz++;
    if (emptyBizList.length < 10) emptyBizList.push({ line: r._lineNum, name: r['사업체명'], seq: r['순번'] });
  }
  if (s24 && s24 !== '') {
    hasSales24++;
    if (sampleSales.length < 5) sampleSales.push({ line: r._lineNum, name: r['사업체명'], s24, s25 });
  }
  if (s25 && s25 !== '') hasSales25++;
  if (emp && emp !== '') hasEmp++;
  if (closed && closed.includes('폐업')) closedCount++;
});

console.log('Empty Biz count:', emptyBiz);
console.log('Rows with 24 Sales:', hasSales24);
console.log('Rows with 25 Sales:', hasSales25);
console.log('Rows with Emp count:', hasEmp);
console.log('Closed count:', closedCount);
console.log('Sample empty biz:', emptyBizList);
console.log('Sample sales rows:', sampleSales);
