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

// Find completed sample rows from different authors
const samples = [];
for (let i = 1; i < lines.length && samples.length < 10; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] !== '배현명') {
    samples.push({ line: i + 1, cols });
  }
}

samples.forEach((s, idx) => {
  console.log(`\n--- Sample ${idx + 1} (Line ${s.line}, Author: ${s.cols[0]}) ---`);
  header.forEach((h, colIdx) => {
    if (s.cols[colIdx] && s.cols[colIdx].trim()) {
      console.log(`  [${colIdx}] ${h}: ${s.cols[colIdx]}`);
    }
  });
});
