const fs = require('fs');

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

const filePath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const bhmRows = [];
let seq = 0;
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    seq++;
    bhmRows.push({ seq, lineNum: i + 1, cols });
  }
}

// Separate by category:
// 1. 사업자번호 오류 / 조회 불가 4건
// 2. 가동 중이나 전화번호 누락 61건
// 3. 폐업 82건

const errorItems = [];
const noPhoneItems = [];
const closedItems = [];

bhmRows.forEach(r => {
  const note = (r.cols[1] || '').trim();
  const company = (r.cols[2] || '').trim();
  const bizNo = (r.cols[3] || '').trim();
  const rep = (r.cols[4] || '').trim();
  const addr = (r.cols[6] || '').trim();
  const phone = (r.cols[7] || '').trim();
  const hp = (r.cols[9] || '').trim();

  if (bizNo === '3071222209' || bizNo === '6424100108' || bizNo === '6611101191' || !addr) {
    errorItems.push({ seq: r.seq, lineNum: r.lineNum, company, bizNo, rep, addr, phone });
  } else if (note === '폐업') {
    closedItems.push({ seq: r.seq, lineNum: r.lineNum, company, bizNo, rep, addr, phone });
  } else if (!phone) {
    noPhoneItems.push({ seq: r.seq, lineNum: r.lineNum, company, bizNo, rep, addr, hp });
  }
});

console.log('Error items count:', errorItems.length);
console.log('No phone active items count:', noPhoneItems.length);
console.log('Closed items count:', closedItems.length);
