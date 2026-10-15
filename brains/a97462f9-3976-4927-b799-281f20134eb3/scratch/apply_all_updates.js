const fs = require('fs');
const path = require('path');

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

function escapeCSVField(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function rowToCSV(row) {
  return row.map(escapeCSVField).join(',');
}

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');

// Check BOM
const hasBOM = content.charCodeAt(0) === 0xFEFF;
const cleanContent = hasBOM ? content.slice(1) : content;

const rows = parseFullCSV(cleanContent);
console.log(`Initial rows count: ${rows.length} (Header: 1, Data: ${rows.length - 1})`);

const header = rows[0];
const dataRows = rows.slice(1);

// Step 1: Clean all internal newlines in every field of data rows
let cleanedNewlineCount = 0;
dataRows.forEach((row, rIdx) => {
  // Ensure exactly 19 fields
  while (row.length < 19) row.push('');
  if (row.length > 19) row.length = 19;

  for (let c = 0; c < row.length; c++) {
    if (typeof row[c] === 'string' && (row[c].includes('\n') || row[c].includes('\r'))) {
      cleanedNewlineCount++;
      // Replace newline with space, collapse multiple spaces
      row[c] = row[c].replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    }
  }
});
console.log(`Cleaned internal newlines in fields: ${cleanedNewlineCount} occurrences`);

// Helper to find data row by Seq or BizNo or Name
function findRow(criteria) {
  return dataRows.find(r => {
    if (criteria.seq !== undefined && String(r[1]).trim() === String(criteria.seq).trim()) return true;
    if (criteria.biz && r[3] && r[3].replace(/-/g, '').trim() === criteria.biz.replace(/-/g, '').trim()) return true;
    if (criteria.name && r[2] && r[2].trim() === criteria.name.trim()) return true;
    return false;
  });
}

function findAllRows(criteria) {
  return dataRows.filter(r => {
    if (criteria.seq !== undefined && String(r[1]).trim() === String(criteria.seq).trim()) return true;
    if (criteria.biz && r[3] && r[3].replace(/-/g, '').trim() === criteria.biz.replace(/-/g, '').trim()) return true;
    if (criteria.name && r[2] && r[2].trim() === criteria.name.trim()) return true;
    return false;
  });
}

// Step 2: Apply User's 7 Target Companies
console.log('\n--- Applying 7 Target Companies ---');

// 1. 운도게임스튜디오 (Seq 2087)
const undoRow = findRow({ seq: 2087 });
if (undoRow) {
  undoRow[6] = '김도현';
  undoRow[7] = '010-7733-6343';
  undoRow[11] = '게임';
  undoRow[14] = '확인불가(미등록 창작팀)';
  console.log(`[Applied] 운도게임스튜디오 (Seq 2087)`);
}

// 2. 비바몬스터 (Seq 2093)
const vivaRow = findRow({ seq: 2093 });
if (vivaRow) {
  vivaRow[3] = '646-87-02732';
  vivaRow[4] = '2022';
  vivaRow[5] = '10';
  vivaRow[7] = '051-123-1234';
  vivaRow[9] = '남구';
  vivaRow[10] = '남구 대연3동 55-1번지 21센츄리오피스텔 1901호';
  vivaRow[11] = '광고';
  vivaRow[14] = '법인설립 2022년 10월, 법인번호 180111-1481794 (쿠키딜/대법원등기부 기준, 인허가 2024-10-04)';
  vivaRow[15] = '3';
  console.log(`[Applied] 비바몬스터 (Seq 2093)`);
}

// 3. 와라봐라 (Seq 2099)
const waraRow = findRow({ seq: 2099 });
if (waraRow) {
  waraRow[7] = '051-582-0944';
  waraRow[9] = '남구';
  waraRow[10] = '남구 용호동 동명로';
  waraRow[11] = '만화';
  waraRow[14] = '확인불가(미등록/폐업)';
  console.log(`[Applied] 와라봐라 (Seq 2099)`);
}

// 4. 조은글방 (Seq 2100)
const joeunRow = findRow({ seq: 2100 });
if (joeunRow) {
  joeunRow[7] = '051-896-9967';
  joeunRow[9] = '부산진구';
  joeunRow[10] = '부산광역시 부산진구 개금본동로 40 (개금동)';
  joeunRow[11] = '만화';
  joeunRow[14] = '폐업(과거 만화대여점)';
  console.log(`[Applied] 조은글방 (Seq 2100)`);
}

// 5. 엠에스네트워크 (Seq 2104)
const msRow = findRow({ seq: 2104 });
if (msRow) {
  msRow[7] = '051-505-4437';
  msRow[11] = '만화';
  msRow[14] = '확인불가';
  console.log(`[Applied] 엠에스네트워크 (Seq 2104)`);
}

// 6. 스튜디오바다 (Seq 2106)
const badaRow = findRow({ seq: 2106 });
if (badaRow) {
  badaRow[6] = '류수환';
  badaRow[7] = '010-3855-8918';
  badaRow[9] = '동구';
  badaRow[10] = '부산광역시 동구 증산서로 52 (문화공간반달)';
  badaRow[11] = '방송';
  badaRow[14] = '확인불가(미등록 창작팀 / 독립출판 등록)';
  console.log(`[Applied] 스튜디오바다 (Seq 2106)`);
}

// 7. 스튜디오더블린 (Seq 2116)
const dublinRow = findRow({ seq: 2116 });
if (dublinRow) {
  dublinRow[7] = '051-557-2381';
  dublinRow[11] = '애니메이션';
  dublinRow[14] = '확인불가(미등록 창작팀)';
  console.log(`[Applied] 스튜디오더블린 (Seq 2116)`);
}

// Step 3: Verified Sales from Excel Inspection
console.log('\n--- Applying Sales from Excel Inspection ---');
const excelSalesList = [
  { seq: 1772, name: '북컬쳐(부산)', biz: '622-01-46462', s24: '2,903,290,000', emp: '12', source: '사람인' },
  { seq: 1799, name: '케이텍', biz: '714-11-01026', s24: '1,988,430,000', emp: '10', source: '사람인' },
  { seq: 1811, name: '레고스토어 (센텀시티몰점)', s24: '30,000,000,000', emp: '2', source: '잡코리아/비즈노', note: '본사자료 공유(알비스)' },
  { seq: 1785, name: '영풍문고 신세계 센텀시티점', s24: '149,511,000,000', s25: '145,270,330,000', emp: '7', source: 'DART 감사보고서', note: '본사자료 공유(영풍문고)' },
  { seq: 1788, name: '（주）교보문고 해운대 팝업스토어', s24: '820,000,000,000', source: 'DART 전자공시', note: '본사자료 공유(교보문고)' },
  { seq: 1794, name: '노블레스미디어인터내셔날부산', s24: '21,250,000,000', source: '사람인/잡코리아', note: '본사자료 공유' },
  { seq: 1803, name: '롯데쇼핑(주)토이저러스 동부산점', s24: '14,555,900,000,000', emp: '10', source: 'DART 사업보고서', note: '본사자료 공유(롯데쇼핑)' }
];

excelSalesList.forEach(item => {
  const r = findRow({ seq: item.seq });
  if (r) {
    if (item.s24 && (!r[16] || r[16].trim() === '')) r[16] = item.s24;
    if (item.s25 && (!r[17] || r[17].trim() === '')) r[17] = item.s25;
    if (item.emp && (!r[15] || r[15].trim() === '')) r[15] = item.emp;
    
    let noteParts = [];
    if (r[14] && r[14].trim() !== '') noteParts.push(r[14].trim());
    if (item.note && !noteParts.some(p => p.includes(item.note))) noteParts.push(item.note);
    const srcTag = `[출처: ${item.source}]`;
    if (!noteParts.some(p => p.includes(item.source))) noteParts.push(srcTag);
    r[14] = noteParts.join(' ');
    console.log(`[Applied Sales] [Seq ${r[1]}] ${r[2]} | S24: ${r[16]} | S25: ${r[17]} | Note: ${r[14]}`);
  }
});

// Step 4: Add Sources to Existing Sales Rows from Excel Inspection
console.log('\n--- Adding Sources to Existing Sales Rows ---');
const existingSalesSources = [
  { seq: 702, source: '실사검증/사람인' },
  { seq: 638, source: '대한전문건설협회' },
  { seq: 1541, source: '잡코리아' },
  { seq: 1566, source: '사람인/잡코리아' },
  { seq: 1629, source: '잡코리아/인크루트' },
  { seq: 1644, source: '인크루트/잡코리아' },
  { seq: 1685, source: '실사검증' },
  { seq: 1731, source: '사람인/인크루트' },
  { seq: 1756, source: '실사검증' },
  { seq: 1762, source: '실사검증' },
  { seq: 1777, source: '사람인' },
  { seq: 1805, source: '인크루트/쿠키딜' },
  { seq: 1806, source: 'DART/인크루트', note: '본사자료 공유' },
  { seq: 1814, source: 'NICE평가정보/사람인' },
  { seq: 1815, source: 'NICE평가정보/잡코리아' },
  { seq: 1816, source: '잡코리아/비즈노' }
];

existingSalesSources.forEach(item => {
  const r = findRow({ seq: item.seq });
  if (r) {
    let noteParts = [];
    if (r[14] && r[14].trim() !== '') noteParts.push(r[14].trim());
    if (item.note && !noteParts.some(p => p.includes(item.note))) noteParts.push(item.note);
    const srcTag = `[출처: ${item.source}]`;
    if (!noteParts.some(p => p.includes(item.source))) noteParts.push(srcTag);
    r[14] = noteParts.join(' ');
    console.log(`[Source Attached] [Seq ${r[1]}] ${r[2]} -> Note: ${r[14]}`);
  }
});

// Step 5: Apply Newly Discovered Verified Sales for Busan CT Companies
console.log('\n--- Applying Newly Discovered Verified Sales ---');
const newlyDiscovered = [
  { seq: 153, s24: '83,348,210,000', source: '사람인/DART/캐치', note: '' },
  { seq: 2075, s24: '83,348,210,000', source: '사람인/DART/캐치', note: '' },
  { seq: 2, s25: '975,440,000', source: '사람인/잡코리아', note: '' },
  { seq: 60, s24: '8,120,000', source: '사람인/NICE평가정보', note: '' },
  { seq: 94, s25: '388,170,000', source: '사람인/잡코리아', note: '' },
  { seq: 97, s25: '17,500,000,000', source: '사람인/잡코리아/언론보도', note: '' },
  { seq: 122, s24: '3,900,000,000', source: '사람인/잡코리아', note: '' },
  { seq: 192, s24: '2,045,430,000', emp: '11', source: 'NICE평가정보/사람인', note: '' },
  { seq: 220, s24: '303,140,000', source: '사람인/동서대창업보육', note: '' },
  { seq: 250, s24: '297,580,000', source: '사람인/잡코리아', note: '' },
  { seq: 434, s25: '5,666,960,000', source: '인크루트/사람인/잡코리아', note: '' }
];

newlyDiscovered.forEach(item => {
  const r = findRow({ seq: item.seq });
  if (r) {
    if (item.s24 && (!r[16] || r[16].trim() === '')) r[16] = item.s24;
    if (item.s25 && (!r[17] || r[17].trim() === '')) r[17] = item.s25;
    if (item.emp && (!r[15] || r[15].trim() === '')) r[15] = item.emp;

    let noteParts = [];
    if (r[14] && r[14].trim() !== '') noteParts.push(r[14].trim());
    if (item.note && !noteParts.some(p => p.includes(item.note))) noteParts.push(item.note);
    const srcTag = `[출처: ${item.source}]`;
    if (!noteParts.some(p => p.includes(item.source))) noteParts.push(srcTag);
    r[14] = noteParts.join(' ');
    console.log(`[New Sales Applied] [Seq ${r[1]}] ${r[2]} | S24: ${r[16]} | S25: ${r[17]} | Note: ${r[14]}`);
  }
});

// Step 6: Apply Closed Companies from Tax Office
console.log('\n--- Applying Closed Companies Info ---');
const closedList = [
  { seq: 125, date: '폐업자', note: '국세청 폐업 확인' },
  { seq: 618, date: '2023-12-08', note: '국세청 폐업 확인' },
  { seq: 707, date: '2015-04-21', note: '국세청 폐업 확인' },
  { seq: 830, date: '2008-12-15', note: '국세청 폐업 확인' },
  { seq: 1033, date: '2019-09-30', note: '국세청 폐업 확인' },
  { seq: 1050, date: '2016-06-30', note: '국세청 폐업 확인' },
  { seq: 1060, date: '2023-05-04', note: '국세청 폐업 확인' },
  { seq: 1178, date: '2024-06-30', note: '국세청 폐업 확인' },
  { seq: 1341, date: '2021-07-25', note: '국세청 폐업 확인' },
  { seq: 1492, date: '2010-08-31', note: '국세청 폐업 확인' },
  { seq: 1588, date: '2026-06-30', note: '국세청 폐업 확인' },
  { seq: 1603, date: '2021-01-01', note: '국세청 폐업 확인' },
  { seq: 1625, date: '2018-11-06', note: '국세청 폐업 확인' },
  { seq: 1718, date: '2025-02-28', note: '국세청 폐업 확인' },
  { seq: 1719, date: '2023-09-06', note: '국세청 폐업 확인' },
  { seq: 1743, date: '2026-07-20', note: '국세청 폐업 확인' },
  { seq: 1766, date: '2025-12-20', note: '국세청 폐업 확인' },
  { seq: 1792, date: '2020-07-31', note: '국세청 폐업 확인' },
  { seq: 1796, date: '2017-12-24', note: '국세청 폐업 확인' },
  { seq: 1797, date: '2024-12-31', note: '국세청 폐업 확인' }
];

closedList.forEach(item => {
  const r = findRow({ seq: item.seq });
  if (r) {
    if (!r[13] || r[13].trim() === '') r[13] = item.date;
    let noteParts = [];
    if (r[14] && r[14].trim() !== '') noteParts.push(r[14].trim());
    if (!noteParts.some(p => p.includes(item.note))) noteParts.push(item.note);
    r[14] = noteParts.join(' ');
    console.log(`[Closed Updated] [Seq ${r[1]}] ${r[2]} | Closed: ${r[13]} | Note: ${r[14]}`);
  }
});

// Step 7: Build Final CSV content
const finalRows = [header, ...dataRows];
console.log(`\nFinal row count: ${finalRows.length} (Header: 1, Data: ${dataRows.length})`);

// Ensure every single row has exactly 19 columns and no raw newlines
let errorCount = 0;
finalRows.forEach((r, idx) => {
  if (r.length !== 19) {
    console.error(`ERROR: Row ${idx} has ${r.length} columns!`);
    errorCount++;
  }
  for (let c = 0; c < r.length; c++) {
    if (typeof r[c] === 'string' && (r[c].includes('\n') || r[c].includes('\r'))) {
      console.error(`ERROR: Row ${idx}, Col ${c} still has newline!`);
      errorCount++;
    }
  }
});

if (errorCount > 0) {
  console.error(`Aborting write due to ${errorCount} errors.`);
  process.exit(1);
}

// Convert to CSV lines
const csvLines = finalRows.map(rowToCSV);
const finalCSVString = (hasBOM ? '\uFEFF' : '') + csvLines.join('\r\n') + '\r\n';

// Write to temp file first
const tempPath = 'C:/Users/lg/Desktop/Today/temp_verified_output.csv';
fs.writeFileSync(tempPath, finalCSVString, 'utf8');
console.log(`Wrote temp file: ${tempPath} (Size: ${fs.statSync(tempPath).size} bytes)`);

// Validate temp file
const reContent = fs.readFileSync(tempPath, 'utf8');
const reClean = reContent.charCodeAt(0) === 0xFEFF ? reContent.slice(1) : reContent;
const reParsed = parseFullCSV(reClean);
console.log(`Temp validation: Parsed rows = ${reParsed.length}`);

// Check raw physical line count
const physicalLines = reClean.split(/\r?\n/).filter(line => line.trim() !== '');
console.log(`Temp validation: Physical non-empty lines = ${physicalLines.length}`);

if (reParsed.length === 2314 && physicalLines.length === 2314) {
  console.log('PERFECT! Both parsed and physical line count match exactly 2314!');
  // Now copy temp to target
  fs.copyFileSync(tempPath, csvPath);
  fs.unlinkSync(tempPath);
  console.log(`Successfully updated target CSV: ${csvPath}`);
} else {
  console.error(`Validation failed! Parsed: ${reParsed.length}, Physical: ${physicalLines.length}`);
  process.exit(1);
}
