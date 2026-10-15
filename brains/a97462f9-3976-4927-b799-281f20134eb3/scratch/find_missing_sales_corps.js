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

console.log('Total data rows:', data.length);

// Missing sales
const missingSales = [];
data.forEach((r, idx) => {
  const seq = r[1];
  const name = r[2] ? r[2].trim() : '';
  const biz = r[3] ? r[3].trim() : '';
  const corp = r[4] ? r[4].trim() : '';
  const ceo = r[7] ? r[7].trim() : '';
  const phone = r[8] ? r[8].trim() : '';
  const cat = r[12] ? r[12].trim() : '';
  const s24 = r[16] ? r[16].trim() : '';
  const s25 = r[17] ? r[17].trim() : '';
  const note = r[18] ? r[18].trim() : '';

  const hasSales = (s24 !== '' || s25 !== '');
  if (!hasSales && biz !== '') {
    // If it's a corporation or has corp number, or name has 주식회사/(주)
    const isCorp = corp !== '' || name.includes('주식회사') || name.includes('(주)') || name.includes('유한회사') || name.includes('㈜');
    missingSales.push({ idx: idx + 2, seq, name, biz, corp, ceo, cat, isCorp, note });
  }
});

console.log('Missing sales with BizNo:', missingSales.length);
const corpsMissingSales = missingSales.filter(m => m.isCorp);
console.log('Corporations missing sales:', corpsMissingSales.length);

console.log('\nTop 30 corporations missing sales:');
corpsMissingSales.slice(0, 30).forEach(c => {
  console.log(`[Seq ${c.seq} / R${c.idx}] ${c.name} | Biz: ${c.biz} | CEO: ${c.ceo} | Cat: ${c.cat} | Note: ${c.note}`);
});
