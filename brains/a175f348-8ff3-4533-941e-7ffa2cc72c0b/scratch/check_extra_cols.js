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
const header = parseCSVLine(lines[0]);

// Let's check how many 배현명 rows have 설립일자 and 형태
let estCount = 0;
let typeCount = 0;
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    if (cols[12] && cols[12].trim()) estCount++;
    if (cols[11] && cols[11].trim()) typeCount++;
  }
}

console.log(`Current 배현명 설립일자: ${estCount}/1000, 형태: ${typeCount}/1000`);
