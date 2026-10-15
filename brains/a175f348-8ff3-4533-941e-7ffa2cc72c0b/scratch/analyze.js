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

console.log('Header Columns (' + header.length + '):');
header.forEach((h, idx) => console.log(idx + ': ' + h));

let bhmRows = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    bhmRows.push({ lineIndex: i + 1, cols, raw: lines[i] });
  }
}

console.log('\nTotal 배현명 rows count:', bhmRows.length);

// Analyze status of 배현명 rows
let filledCount = 0;
let emptyCount = 0;
bhmRows.forEach(r => {
  // Let's check how many columns are filled
  const nonEmpties = r.cols.filter(c => c && c.trim()).length;
  if (nonEmpties > 20) filledCount++;
  else emptyCount++;
});

console.log(`Filled (>20 non-empty fields): ${filledCount}, Partially empty: ${emptyCount}`);

console.log('\nFirst 5 배현명 rows:');
bhmRows.slice(0, 5).forEach(r => {
  console.log(`Line ${r.lineIndex}: Company: "${r.cols[2]}", BizNo: "${r.cols[3]}", Rep: "${r.cols[4]}", Addr: "${r.cols[6]}", Note: "${r.cols[1]}"`);
});

console.log('\nRows around 1094:');
bhmRows.filter(r => r.lineIndex >= 1085 && r.lineIndex <= 1106).forEach(r => {
  console.log(`Line ${r.lineIndex}: Company: "${r.cols[2]}", BizNo: "${r.cols[3]}", Rep: "${r.cols[4]}", Note: "${r.cols[1]}", Industry: "${r.cols[17]}"`);
});
