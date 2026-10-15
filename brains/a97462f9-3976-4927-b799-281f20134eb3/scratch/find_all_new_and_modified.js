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

const origPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const currPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.csv';

const origContent = fs.readFileSync(origPath, 'utf8');
const currContent = fs.readFileSync(currPath, 'utf8');

const origRows = parseCSV(origContent.charCodeAt(0) === 0xFEFF ? origContent.slice(1) : origContent);
const currRows = parseCSV(currContent.charCodeAt(0) === 0xFEFF ? currContent.slice(1) : currContent);

console.log('Orig rows:', origRows.length);
console.log('Curr rows:', currRows.length);

const header = currRows[0];
const diffs = [];

// Match by company name or row index
currRows.slice(1).forEach((currR, idx) => {
  const rowNum = idx + 2;
  const name = currR[2];
  
  // Find matching row in orig
  // We can look at idx+1 in orig or search by name
  let origR = origRows[idx + 1];
  if (!origR || origR[2] !== name) {
    origR = origRows.find(r => r[2] === name);
  }

  if (origR) {
    for (let c = 0; c < 18; c++) {
      const origVal = origR[c] ? origR[c].trim() : '';
      const currVal = currR[c] ? currR[c].trim() : '';
      if (origVal !== currVal) {
        diffs.push({
          rowNum,
          name,
          colIdx: c,
          colName: header[c],
          origVal,
          currVal
        });
      }
    }
  }
});

console.log(`Total diffs (newly found / modified cells): ${diffs.length}`);

// Group by colName
const colSummary = {};
diffs.forEach(d => {
  colSummary[d.colName] = (colSummary[d.colName] || 0) + 1;
});
console.log('Diffs by column:', colSummary);

console.log('\nSample 15 diffs:');
diffs.slice(0, 15).forEach(d => {
  console.log(`Row ${d.rowNum} [${d.name}] Col [${d.colName}]: "${d.origVal}" -> "${d.currVal}"`);
});
