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
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    bhmRows.push({ lineNum: i + 1, cols });
  }
}

console.log(`Total 배현명 rows: ${bhmRows.length}`);

let hasPhone = 0;
let hasHp = 0;
let hasEmail = 0;
let hasRespondentPhone = 0;
let noContactAtAll = 0;

const noContactList = [];

bhmRows.forEach(r => {
  const phone = (r.cols[7] || '').trim();
  const hp = (r.cols[9] || '').trim();
  const email = (r.cols[10] || '').trim();
  const respPhone = (r.cols[55] || '').trim();
  const isClosed = r.cols[1] === '폐업';

  if (phone) hasPhone++;
  if (hp) hasHp++;
  if (email) hasEmail++;
  if (respPhone) hasRespondentPhone++;

  if (!phone && !respPhone && !isClosed) {
    noContactAtAll++;
    noContactList.push({
      line: r.lineNum,
      company: r.cols[2],
      bizNo: r.cols[3],
      rep: r.cols[4],
      addr: r.cols[6]
    });
  }
});

console.log(`\nContact Status Breakdown (Total: ${bhmRows.length}):`);
console.log(`  - Direct Phone (전화번호): ${hasPhone}건`);
console.log(`  - Respondent Phone (응답자연락처): ${hasRespondentPhone}건`);
console.log(`  - Homepage: ${hasHp}건`);
console.log(`  - Email: ${hasEmail}건`);
console.log(`  - Active companies with NO phone at all: ${noContactAtAll}건`);

console.log(`\nFirst 20 active companies needing phone search:`);
noContactList.slice(0, 20).forEach(c => {
  console.log(`  [Line ${c.line}] ${c.company} (사업자: ${c.bizNo}, 대표: ${c.rep}, 주소: ${c.addr})`);
});
