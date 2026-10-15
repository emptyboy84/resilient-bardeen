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
const cleanContent = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
const rows = parseCSV(cleanContent);
const data = rows.slice(1);

const bizMap = {};
data.forEach((r, idx) => {
  const rowNum = idx + 2;
  const seq = r[1];
  const name = r[2] ? r[2].trim() : '';
  const biz = r[3] ? r[3].trim() : '';
  const cleanBiz = biz.replace(/-/g, '');
  if (cleanBiz && /^\d{10}$/.test(cleanBiz)) {
    if (!bizMap[cleanBiz]) bizMap[cleanBiz] = [];
    bizMap[cleanBiz].push({ rowNum, seq, name, r });
  }
});

console.log('=== DUPLICATE BIZ NUMBERS ===');
let dupCount = 0;
Object.entries(bizMap).forEach(([biz, list]) => {
  if (list.length > 1) {
    dupCount++;
    console.log(`\nBiz: ${biz} (${list.length} rows)`);
    list.forEach(item => {
      console.log(`  Row ${item.rowNum} (Seq ${item.seq}): [${item.name}] | Cat: [${item.r[11]}] | CEO: [${item.r[6]}] | Addr: [${item.r[10]}]`);
    });
  }
});
console.log(`Total duplicate biz numbers: ${dupCount}`);
