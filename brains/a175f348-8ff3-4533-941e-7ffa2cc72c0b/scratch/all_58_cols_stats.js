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
const otherRows = [];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    bhmRows.push(cols);
  } else {
    otherRows.push(cols);
  }
}

console.log(`Total 배현명 rows: ${bhmRows.length}`);
console.log(`Total other authors rows: ${otherRows.length}`);

console.log('\n--- All 58 Columns Status Analysis ---');

const colStats = [];

header.forEach((h, idx) => {
  let bhmFilled = 0;
  let otherFilled = 0;

  bhmRows.forEach(r => {
    if (r[idx] && r[idx].trim()) bhmFilled++;
  });

  otherRows.forEach(r => {
    if (r[idx] && r[idx].trim()) otherFilled++;
  });

  const bhmPct = ((bhmFilled / bhmRows.length) * 100).toFixed(1);
  const otherPct = otherRows.length > 0 ? ((otherFilled / otherRows.length) * 100).toFixed(1) : 0;

  colStats.push({
    idx,
    name: h || `(빈열_${idx})`,
    bhmFilled,
    bhmPct,
    otherFilled,
    otherPct
  });
});

console.log(JSON.stringify(colStats, null, 2));
