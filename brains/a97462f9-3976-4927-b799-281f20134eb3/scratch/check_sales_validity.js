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

let countS24 = 0;
let countS25 = 0;
let invalidSales = [];

rows.slice(1).forEach((r, idx) => {
  const rowNum = idx + 2;
  const name = r[2];
  const s24 = r[16] ? r[16].trim() : '';
  const s25 = r[17] ? r[17].trim() : '';

  if (s24) {
    countS24++;
    const num = Number(s24.replace(/,/g, ''));
    if (isNaN(num)) invalidSales.push({ rowNum, name, col: 16, val: s24 });
  }
  if (s25) {
    countS25++;
    const num = Number(s25.replace(/,/g, ''));
    if (isNaN(num)) invalidSales.push({ rowNum, name, col: 17, val: s25 });
  }
});

console.log('Total 24 sales count:', countS24);
console.log('Total 25 sales count:', countS25);
console.log('Invalid sales count:', invalidSales.length);
