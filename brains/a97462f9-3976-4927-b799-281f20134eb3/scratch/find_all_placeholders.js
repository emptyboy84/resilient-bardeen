const fs = require('fs');

function parseCSV(content) {
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
      if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
  }
  return rows;
}

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(content);
const header = rows[0];

console.log('=== CHECKING PLACEHOLDERS AND HYPHENS ACROSS ALL CELLS ===');

const found = [];
rows.slice(1).forEach((r, idx) => {
  const rowNum = idx + 2;
  const name = r[2];
  r.forEach((f, c) => {
    const val = f.trim();
    if (val === '-' || val === '--' || val === '없음' || val === '미등록' || val === 'null' || val === 'N/A') {
      found.push({ rowNum, name, colName: header[c], colIdx: c, val });
    }
  });
});

console.log(`Found ${found.length} placeholder cells:`);
found.forEach(item => {
  console.log(`Row ${item.rowNum} [${item.name}] Col ${item.colIdx} (${item.colName}): [${item.val}]`);
});
