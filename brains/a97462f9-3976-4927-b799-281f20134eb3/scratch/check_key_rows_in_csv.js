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

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const clean = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
const rows = parseCSV(clean);

console.log(`Master CSV total rows: ${rows.length}`);

// Check specific key rows
const checkRowNums = [703, 639, 649, 1542, 1567, 1630, 1645, 1786, 1789, 1804, 1812, 1815, 1816, 2140, 2141, 2143, 2216, 2223, 2232, 2240, 2243, 2247, 2260, 2262];

checkRowNums.forEach(rNum => {
  const r = rows[rNum - 1]; // 1-based index in Excel, rows[0] is header, so rows[rNum - 1] is row rNum
  if (r) {
    console.log(`[Row ${rNum}] ${r[2]} | Biz: ${r[3]} | CEO: ${r[6]} | Phone: ${r[7]} | Addr: ${r[10]} | 24s: ${r[16]} | 25s: ${r[17]} | Note: ${r[14]}`);
  }
});
