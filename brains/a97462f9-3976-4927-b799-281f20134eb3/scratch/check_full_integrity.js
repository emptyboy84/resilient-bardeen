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

const content = fs.readFileSync('C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv', 'utf8');
const rows = parseCSV(content);

console.log('=== FULL COLUMN BY COLUMN INTEGRITY CHECK ===');

// Check Col 9: 시군구
const sigunguSet = new Set();
// Check Col 11: 업종분류
const catSet = new Set();
// Check Col 12: 컨택결과
const contactSet = new Set();

const weirdFields = [];

rows.slice(1).forEach((r, idx) => {
  const rowNum = idx + 2;
  const name = r[2] ? r[2].trim() : '';

  // Col 4: estYear
  const ey = r[4] ? r[4].trim() : '';
  if (ey && (!/^\d{4}$/.test(ey) || parseInt(ey) < 1900 || parseInt(ey) > 2026)) {
    weirdFields.push({ rowNum, name, col: '설립연도', val: ey });
  }

  // Col 5: estMonth
  const em = r[5] ? r[5].trim() : '';
  if (em && (!/^\d{1,2}$/.test(em) || parseInt(em) < 1 || parseInt(em) > 12)) {
    weirdFields.push({ rowNum, name, col: '설립월', val: em });
  }

  // Col 9: sigungu
  const sg = r[9] ? r[9].trim() : '';
  if (sg) sigunguSet.add(sg);

  // Col 11: cat
  const cat = r[11] ? r[11].trim() : '';
  if (cat) catSet.add(cat);

  // Col 12: contact
  const ct = r[12] ? r[12].trim() : '';
  if (ct) contactSet.add(ct);

  // Col 16, 17: sales
  [16, 17].forEach(cIdx => {
    const s = r[cIdx] ? r[cIdx].trim() : '';
    if (s && s !== '-' && s !== '0') {
      const clean = s.replace(/,/g, '');
      if (isNaN(clean)) {
        weirdFields.push({ rowNum, name, col: `매출액 Col${cIdx}`, val: s });
      }
    }
  });
});

console.log('Weird fields found:', weirdFields);
console.log('\nUnique 시군구:', [...sigunguSet]);
console.log('\nUnique 업종분류:', [...catSet]);
console.log('\nUnique 컨택결과:', [...contactSet]);
