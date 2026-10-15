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
      if (currentRow.some(f => f.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) {
      rows.push(currentRow);
    }
  }
  return rows;
}

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const parsed = parseFullCSV(content);

const header = parsed[0];
const dataRows = parsed.slice(1);

// Let's analyze the 222 missing biz rows
const missingBiz = [];
dataRows.forEach((r, idx) => {
  const rowNum = idx + 2;
  const biz = r[3] ? r[3].trim() : '';
  if (!biz) {
    missingBiz.push({
      rowNum,
      seq: r[1],
      name: r[2],
      ceo: r[6],
      tel: r[7],
      addr: r[10],
      cat: r[11],
      remark: r[14]
    });
  }
});

console.log('Total missing biz:', missingBiz.length);

// Breakdown by category
const catCount = {};
missingBiz.forEach(m => {
  catCount[m.cat] = (catCount[m.cat] || 0) + 1;
});
console.log('Missing biz by category:', catCount);

// Sample 15
console.log('Sample missing biz:', missingBiz.slice(0, 15).map(m => `${m.rowNum}행 [${m.cat}] ${m.name} / ${m.ceo || '대표없음'} / ${m.tel || '전화없음'}`));

// Let's analyze sales distribution by category for existing sales
const salesCatCount = {};
dataRows.forEach(r => {
  const s24 = r[16] ? r[16].trim() : '';
  const cat = r[11];
  if (s24) {
    salesCatCount[cat] = (salesCatCount[cat] || 0) + 1;
  }
});
console.log('Companies WITH 2024 sales by category:', salesCatCount);
