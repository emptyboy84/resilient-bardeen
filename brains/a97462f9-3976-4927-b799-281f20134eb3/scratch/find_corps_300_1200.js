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
const data = rows.slice(1);

// Look at rows 300 to 1000
const corps = data.filter((r, idx) => {
  const seq = parseInt(r[1], 10);
  const name = r[2] ? r[2].trim() : '';
  const biz = r[3] ? r[3].trim() : '';
  const s24 = r[16] ? r[16].trim() : '';
  const s25 = r[17] ? r[17].trim() : '';
  return seq >= 300 && seq <= 1200 && (name.includes('주식회사') || name.includes('(주)') || name.includes('㈜')) && biz !== '' && !s24 && !s25;
});

console.log('Corps between Seq 300 and 1200 without sales:', corps.length);
corps.slice(0, 30).forEach(c => {
  console.log(`[Seq ${c[1]}] ${c[2]} | Biz: ${c[3]} | Cat: ${c[11]} | CEO: ${c[6]}`);
});
