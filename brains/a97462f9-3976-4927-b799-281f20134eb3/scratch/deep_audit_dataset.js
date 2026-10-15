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
const header = rows[0];
const data = rows.slice(1);

console.log('=== DEEP AUDIT: Header & Columns ===');
console.log('Header length:', header.length);
header.forEach((h, idx) => console.log(`Col ${idx}: [${h}]`));

const issues = {
  columnCountMismatch: [],
  nameMissing: [],
  bizFormatWeird: [],
  bizDuplicates: {},
  estYearWeird: [],
  estMonthWeird: [],
  closedDateWeird: [],
  salesFormatWeird: [],
  empFormatWeird: [],
  categoryMissing: [],
  newlineInFields: [],
  contactResultStats: {},
  categoryStats: {}
};

const bizMap = {};

data.forEach((r, idx) => {
  const rowNum = idx + 2;
  const seq = r[1];
  const name = r[2] ? r[2].trim() : '';
  const biz = r[3] ? r[3].trim() : '';
  const estY = r[4] ? r[4].trim() : '';
  const estM = r[5] ? r[5].trim() : '';
  const ceo = r[6] ? r[6].trim() : '';
  const phone = r[7] ? r[7].trim() : '';
  const fax = r[8] ? r[8].trim() : '';
  const sigungu = r[9] ? r[9].trim() : '';
  const addr = r[10] ? r[10].trim() : '';
  const cat = r[11] ? r[11].trim() : '';
  const contact = r[12] ? r[12].trim() : '';
  const closedDate = r[13] ? r[13].trim() : '';
  const note = r[14] ? r[14].trim() : '';
  const emp = r[15] ? r[15].trim() : '';
  const s24 = r[16] ? r[16].trim() : '';
  const s25 = r[17] ? r[17].trim() : '';

  // 1. Column count
  if (r.length !== 19) {
    issues.columnCountMismatch.push({ rowNum, length: r.length });
  }

  // 2. Name check
  if (!name) {
    issues.nameMissing.push({ rowNum, seq });
  }

  // 3. Biz check
  if (biz) {
    const cleanBiz = biz.replace(/-/g, '');
    if (!/^\d{10}$/.test(cleanBiz)) {
      issues.bizFormatWeird.push({ rowNum, seq, name, biz });
    }
    // Check duplicates
    if (!bizMap[cleanBiz]) bizMap[cleanBiz] = [];
    bizMap[cleanBiz].push({ rowNum, seq, name });
  }

  // 4. Est Year/Month
  if (estY && (!/^\d{4}$/.test(estY) || parseInt(estY) < 1900 || parseInt(estY) > 2026)) {
    issues.estYearWeird.push({ rowNum, seq, name, estY });
  }
  if (estM && (!/^\d{1,2}$/.test(estM) || parseInt(estM) < 1 || parseInt(estM) > 12)) {
    issues.estMonthWeird.push({ rowNum, seq, name, estM });
  }

  // 5. Closed Date
  if (closedDate) {
    // Expected: YYYY-MM-DD or standard date format, or '폐업자'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(closedDate) && closedDate !== '폐업자' && closedDate !== '폐업') {
      issues.closedDateWeird.push({ rowNum, seq, name, closedDate });
    }
  }

  // 6. Sales format
  [s24, s25].forEach((s, sIdx) => {
    if (s) {
      const cleanS = s.replace(/,/g, '').trim();
      if (isNaN(cleanS) && s !== '-' && s !== '0') {
        issues.salesFormatWeird.push({ rowNum, seq, name, col: sIdx === 0 ? 's24' : 's25', val: s });
      }
    }
  });

  // 7. Emp format
  if (emp) {
    const cleanEmp = emp.replace(/,/g, '').trim();
    if (isNaN(cleanEmp)) {
      issues.empFormatWeird.push({ rowNum, seq, name, emp });
    }
  }

  // 8. Category
  if (!cat) {
    issues.categoryMissing.push({ rowNum, seq, name });
  } else {
    issues.categoryStats[cat] = (issues.categoryStats[cat] || 0) + 1;
  }

  // 9. Newline in any field
  r.forEach((f, fIdx) => {
    if (typeof f === 'string' && (f.includes('\n') || f.includes('\r'))) {
      issues.newlineInFields.push({ rowNum, seq, col: fIdx, val: f });
    }
  });

  if (contact) {
    issues.contactResultStats[contact] = (issues.contactResultStats[contact] || 0) + 1;
  }
});

// Check duplicate biz
Object.entries(bizMap).forEach(([b, list]) => {
  if (list.length > 1) {
    issues.bizDuplicates[b] = list;
  }
});

console.log('\n=== AUDIT RESULTS ===');
console.log('1. Column count mismatch:', issues.columnCountMismatch.length);
console.log('2. Name missing:', issues.nameMissing.length);
console.log('3. Biz format weird:', issues.bizFormatWeird.length, issues.bizFormatWeird);
console.log('4. Biz duplicates (count):', Object.keys(issues.bizDuplicates).length);
console.log('5. Est Year weird:', issues.estYearWeird.length, issues.estYearWeird);
console.log('6. Est Month weird:', issues.estMonthWeird.length, issues.estMonthWeird);
console.log('7. Closed date weird:', issues.closedDateWeird.length, issues.closedDateWeird.slice(0, 10));
console.log('8. Sales format weird:', issues.salesFormatWeird.length, issues.salesFormatWeird);
console.log('9. Emp format weird:', issues.empFormatWeird.length, issues.empFormatWeird);
console.log('10. Category missing:', issues.categoryMissing.length);
console.log('11. Newline in fields:', issues.newlineInFields.length);
console.log('\nCategory breakdown:', issues.categoryStats);
console.log('Contact results breakdown:', issues.contactResultStats);
