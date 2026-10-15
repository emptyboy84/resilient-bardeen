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
console.log('Total parsed rows:', rows.length);
rows.slice(1).forEach((r, idx) => {
  const cd = r[13] ? r[13].trim() : '';
  if (cd && !/^\d{4}-\d{2}-\d{2}$/.test(cd) && cd !== '폐업자' && cd !== '폐업') {
    console.log('Row', idx + 2, 'Seq', r[1], `[${r[2]}]`, 'Col13 [폐업날짜]:', `[${cd}]`, 'Col14 [비고]:', `[${r[14]}]`);
  }
});
