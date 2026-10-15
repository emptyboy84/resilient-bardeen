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

let bhmRanges = [];
let currentRange = null;

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    if (!currentRange) {
      currentRange = { start: i + 1, end: i + 1, count: 1 };
    } else if (i + 1 === currentRange.end + 1) {
      currentRange.end = i + 1;
      currentRange.count++;
    } else {
      bhmRanges.push(currentRange);
      currentRange = { start: i + 1, end: i + 1, count: 1 };
    }
  }
}
if (currentRange) bhmRanges.push(currentRange);

console.log('BHM contiguous blocks:');
bhmRanges.forEach((r, idx) => {
  console.log(`Block ${idx + 1}: Lines ${r.start} - ${r.end} (${r.count} rows)`);
});
