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
const cleanContent = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
const rows = parseFullCSV(cleanContent);
const data = rows.slice(1);

const bizMap = {};
data.forEach((r, idx) => {
  const biz = r[3] ? r[3].replace(/-/g, '').trim() : '';
  if (biz && biz.length === 10) {
    if (!bizMap[biz]) bizMap[biz] = [];
    bizMap[biz].push({ rowNum: idx + 2, seq: r[1], name: r[2], cat: r[11], s24: r[16], s25: r[17], note: r[14] });
  }
});

const dups = Object.entries(bizMap).filter(([b, list]) => list.length > 1);
console.log(`Total duplicate biz groups: ${dups.length}`);
dups.forEach(([b, list], idx) => {
  console.log(`\n[Group ${idx + 1}] Biz: ${b}`);
  list.forEach(item => {
    console.log(`  Row ${item.rowNum} (Seq ${item.seq}) ${item.name} | Cat: ${item.cat} | S24: ${item.s24} | S25: ${item.s25} | Note: ${item.note}`);
  });
});
