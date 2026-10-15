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

const content = fs.readFileSync('C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv', 'utf8');
const rows = parseCSV(content);

console.log('=== Checking Col 0 (구분) and Col 1 (순번) ===');
const col0Set = new Set();
const weirdCol1 = [];

rows.slice(1).forEach((r, idx) => {
  const rowNum = idx + 2;
  const col0 = r[0] ? r[0].trim() : '';
  const col1 = r[1] ? r[1].trim() : '';
  col0Set.add(col0);
  if (col1 && isNaN(col1)) {
    weirdCol1.push({ rowNum, name: r[2], col0, col1 });
  }
});

console.log('Unique Col 0 values:', [...col0Set]);
console.log('Non-numeric Col 1 values:', weirdCol1);
