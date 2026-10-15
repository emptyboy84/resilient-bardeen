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

const blueTargets = [
  { name: '삼주', biz: '602-81-40485', s24: '13,500,000,000', s25: '14,000,000,000', source: 'DART 감사보고서/서울거래 비상장' },
  { name: '넥슨커뮤니케이션즈', biz: '617-81-94173', s24: '6,306,000,000', source: '캐치/잡코리아/DART' },
  { name: '블루솜', biz: '617-81-57256', s25: '981,230,000', emp: '7', source: '인크루트/사람인/잡코리아' },
  { name: '코시', biz: '607-81-27134', s25: '8,023,100,000', source: '인크루트/잡플래닛/캐치' },
  { name: '큐로드부산지사', biz: '120-88-24018', s25: '25,200,000,000', note: '본사자료 공유', source: 'DART 전자공시/스팩합병 증권신고서/캐치' },
  { name: '유티플러스 인터랙티브', biz: '214-87-95150', s24: '4,100,000,000', emp: '98', source: '캐치/잡코리아' },
  { name: '포텐츠', biz: '592-81-00847', s24: '141,100,000', source: '사람인/사상구 기업정보' },
  { name: '파크이에스엠', biz: '214-87-80017', s24: '2,000,000,000', emp: '20', source: '잡코리아/게임잡/인크루트' },
  { name: '빅잼', biz: '607-86-01783', s24: '98,920,000', source: '사람인' },
  { name: '늘아이엔씨', biz: '606-81-85602', s24: '227,650,000', source: '사람인/캐치' },
  { name: '숲과교육 주식회사', biz: '355-87-02802', s25: '66,270,000', source: '잡코리아/사람인/NICE평가정보' }
];

console.log('Matching blue targets in target CSV:');
blueTargets.forEach(t => {
  // match by biz
  let match = data.find(r => r[3] && r[3].replace(/-/g, '').trim() === t.biz.replace(/-/g, '').trim());
  if (!match) {
    // match by name
    match = data.find(r => r[2] && r[2].trim().includes(t.name));
  }

  if (match) {
    console.log(`[FOUND] ${t.name} -> CSV [Seq ${match[1]}] ${match[2]} | Biz: ${match[3]} | Current S24: [${match[16]}], S25: [${match[17]}], Note: [${match[14]}]`);
  } else {
    console.log(`[NOT FOUND] ${t.name} (Biz: ${t.biz})`);
  }
});
