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

const bhmRows = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    bhmRows.push({ lineIndex: i + 1, cols, raw: lines[i] });
  }
}

console.log('Total 배현명 rows:', bhmRows.length);

const stats = {};
header.forEach((h, idx) => {
  stats[idx] = { name: h, filled: 0, empty: 0 };
});

bhmRows.forEach(r => {
  r.cols.forEach((val, idx) => {
    if (stats[idx]) {
      if (val && val.trim()) stats[idx].filled++;
      else stats[idx].empty++;
    }
  });
});

console.log('\nField fill stats for 배현명 (1000 rows):');
Object.keys(stats).forEach(idx => {
  const s = stats[idx];
  if (s.filled > 0 || idx <= 17 || idx === 23 || idx === 24 || idx === 30 || idx >= 47) {
    console.log(`[${idx}] ${s.name}: ${s.filled} filled / ${s.empty} empty (${((s.filled/1000)*100).toFixed(1)}%)`);
  }
});
