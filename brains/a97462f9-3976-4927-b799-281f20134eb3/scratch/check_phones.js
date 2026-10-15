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

let phoneIssues = [];
rows.slice(1).forEach((r, idx) => {
  const p = r[7] ? r[7].trim() : '';
  if (p && /^\d{10,11}$/.test(p)) {
    // Unhyphenated mobile or phone like 01020540473
    phoneIssues.push({ rowNum: idx + 2, name: r[2], phone: p });
  }
});

console.log('Unhyphenated phone numbers:', phoneIssues.length);
if (phoneIssues.length > 0) {
  console.log(phoneIssues);
}
