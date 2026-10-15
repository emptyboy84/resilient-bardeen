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

let noPhoneCount = 0;
let noBizCount = 0;
let noSalesCount = 0;
let emptyDataRows = [];

rows.slice(1).forEach((r, idx) => {
  const name = r[2];
  const biz = r[3];
  const phone = r[7];
  const s24 = r[16];
  const s25 = r[17];
  const note = r[14];
  const contact = r[12];
  const closed = r[13];

  if (!phone) noPhoneCount++;
  if (!biz) noBizCount++;
  if (!s24 && !s25) noSalesCount++;

  // Rows with almost no data: no biz, no phone, no sales, no ceo, no addr...
  const hasAddr = !!r[10];
  const hasCeo = !!r[6];
  if (!biz && !phone && !hasAddr && !hasCeo) {
    emptyDataRows.push({ rowNum: idx + 2, name, cat: r[11], note });
  }
});

console.log('Total rows:', rows.length - 1);
console.log('No phone count:', noPhoneCount);
console.log('No biz count:', noBizCount);
console.log('No sales count:', noSalesCount);
console.log('Rows with virtually NO data (no biz, no phone, no addr, no ceo):', emptyDataRows.length, emptyDataRows);
