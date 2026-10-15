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
const hasBOM = content.charCodeAt(0) === 0xFEFF;
const cleanContent = hasBOM ? content.slice(1) : content;

const rows = parseFullCSV(cleanContent);
const header = rows[0];
const dataRows = rows.slice(1);

const blueUpdates = [
  { biz: '602-81-40485', name: '삼주', s24: '13,500,000,000', s25: '14,000,000,000', source: 'DART 감사보고서/서울거래 비상장/NICE평가정보' },
  { biz: '617-81-94173', name: '넥슨커뮤니케이션즈', s24: '6,306,000,000', source: '캐치/잡코리아/DART' },
  { biz: '214-87-95150', name: '유티플러스', s24: '4,100,000,000', emp: '98', source: '캐치/잡코리아' },
  { biz: '617-81-57256', name: '블루솜', s25: '981,230,000', emp: '7', source: '인크루트/사람인/잡코리아' },
  { biz: '355-87-02802', name: '숲과교육', s25: '66,270,000', source: '잡코리아/사람인/NICE평가정보' },
  { biz: '214-87-80017', name: '파크이에스엠', s24: '2,000,000,000', emp: '20', source: '잡코리아/게임잡/인크루트' },
  { biz: '592-81-00847', name: '포텐츠', s24: '141,100,000', source: '사람인/사상구 기업정보' },
  { biz: '606-81-85602', name: '늘아이엔씨', s24: '227,650,000', source: '사람인/캐치' },
  { biz: '607-86-01783', name: '빅잼', s24: '98,920,000', source: '사람인' },
  { biz: '607-81-27134', name: '코시', s25: '8,023,100,000', source: '인크루트/잡플래닛/캐치' },
  { biz: '120-88-24018', name: '큐로드', s25: '25,200,000,000', note: '본사자료 공유', source: 'DART 전자공시/스팩합병 증권신고서/캐치' }
];

let appliedCount = 0;
dataRows.forEach((r, idx) => {
  const rBiz = r[3] ? r[3].replace(/-/g, '').trim() : '';
  const rName = r[2] ? r[2].trim() : '';

  blueUpdates.forEach(u => {
    const uBiz = u.biz.replace(/-/g, '').trim();
    if (rBiz === uBiz || (uBiz && rBiz.includes(uBiz)) || rName.includes(u.name)) {
      if (u.s24 && (!r[16] || r[16].trim() === '')) r[16] = u.s24;
      if (u.s25 && (!r[17] || r[17].trim() === '')) r[17] = u.s25;
      if (u.emp && (!r[15] || r[15].trim() === '')) r[15] = u.emp;

      let noteParts = [];
      if (r[14] && r[14].trim() !== '') noteParts.push(r[14].trim());
      if (u.note && !noteParts.some(p => p.includes(u.note))) noteParts.push(u.note);
      const srcTag = `[출처: ${u.source}]`;
      if (!noteParts.some(p => p.includes(u.source))) noteParts.push(srcTag);
      r[14] = noteParts.join(' ');

      console.log(`[Applied] Row ${idx + 2} (Seq ${r[1]}) ${r[2]} | Biz: ${r[3]} | S24: ${r[16]} | S25: ${r[17]} | Note: ${r[14]}`);
      appliedCount++;
    }
  });
});

console.log(`Total applied updates: ${appliedCount}`);

// Ensure every single row has exactly 19 columns and no newlines
const finalRows = [header, ...dataRows];
finalRows.forEach((r, idx) => {
  while (r.length < 19) r.push('');
  if (r.length > 19) r.length = 19;
});

const csvLines = finalRows.map(rowToCSV);
const finalCSVString = (hasBOM ? '\uFEFF' : '') + csvLines.join('\r\n') + '\r\n';

const tempPath = 'C:/Users/lg/Desktop/Today/temp_blue_verified.csv';
fs.writeFileSync(tempPath, finalCSVString, 'utf8');

const reContent = fs.readFileSync(tempPath, 'utf8');
const reClean = reContent.charCodeAt(0) === 0xFEFF ? reContent.slice(1) : reContent;
const physicalLines = reClean.split(/\r?\n/).filter(line => line.trim() !== '');

if (physicalLines.length === 2314) {
  fs.copyFileSync(tempPath, csvPath);
  fs.unlinkSync(tempPath);
  console.log(`SUCCESS! Target CSV perfectly updated with exactly 2314 lines!`);
} else {
  console.error(`Validation failed! Line count: ${physicalLines.length}`);
  process.exit(1);
}
