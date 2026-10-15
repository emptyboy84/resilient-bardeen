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

let noPhoneAndNoBiz = [];
let noPhoneCount = 0;
let noBizCount = 0;

rows.slice(1).forEach((r, idx) => {
  const rowNum = idx + 2;
  const name = r[2];
  const biz = r[3] ? r[3].trim() : '';
  const phone = r[7] ? r[7].trim() : '';

  if (!phone) noPhoneCount++;
  if (!biz) noBizCount++;
  if (!phone && !biz) {
    noPhoneAndNoBiz.push({ rowNum, name, cat: r[11], addr: r[10], note: r[14] });
  }
});

console.log('No phone count:', noPhoneCount);
console.log('No biz count:', noBizCount);
console.log('Both No phone AND No biz count:', noPhoneAndNoBiz.length);
console.log('Sample both empty:', noPhoneAndNoBiz.slice(0, 15));
