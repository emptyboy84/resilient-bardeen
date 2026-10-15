const fs = require('fs');

function parseFullCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let hasInternalNewline = false;

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
      if (currentRow.some(f => f.trim() !== '')) {
        currentRow._hasInternalNewline = hasInternalNewline;
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      hasInternalNewline = false;
    } else {
      if ((char === '\r' || char === '\n') && inQuotes) {
        hasInternalNewline = true;
      }
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) {
      currentRow._hasInternalNewline = hasInternalNewline;
      rows.push(currentRow);
    }
  }
  return rows;
}

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const rows = parseFullCSV(content);

console.log('Header length:', rows[0].length);
console.log('Total parsed rows (including header):', rows.length);

const multilineRows = [];
rows.forEach((r, idx) => {
  if (r._hasInternalNewline) {
    multilineRows.push({ idx, seq: r[1], name: r[2], fieldsWithNewline: r.map((f, fi) => f.includes('\n') || f.includes('\r') ? fi : -1).filter(fi => fi !== -1) });
  }
});

console.log('Rows with internal newlines:', multilineRows);
