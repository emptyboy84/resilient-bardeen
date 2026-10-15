const fs = require('fs');

function parseFullCSV(content) {
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

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const rows = parseFullCSV(content);
const header = rows[0];
const data = rows.slice(1);

const withSales = data.filter(r => (r[16] && r[16].trim() !== '') || (r[17] && r[17].trim() !== ''));
console.log('Total rows with sales:', withSales.length);

// Count how many have notes
const withNotes = withSales.filter(r => r[14] && r[14].trim() !== '');
console.log('Of those, with notes:', withNotes.length);

console.log('\nSample 20 rows with sales:');
withSales.slice(0, 20).forEach(r => {
  console.log(`[Seq ${r[1]}] ${r[2]} | Biz: ${r[3]} | 24매출: [${r[16]}] | 25매출: [${r[17]}] | 비고: [${r[14]}]`);
});

console.log('\nSample 10 rows with sales that HAVE notes:');
withNotes.slice(0, 10).forEach(r => {
  console.log(`[Seq ${r[1]}] ${r[2]} | Biz: ${r[3]} | 24매출: [${r[16]}] | 25매출: [${r[17]}] | 비고: [${r[14]}]`);
});
