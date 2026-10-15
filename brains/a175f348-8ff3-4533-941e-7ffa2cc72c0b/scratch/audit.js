const fs = require('fs');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

const filePath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
const header = parseCSVLine(lines[0]);

const bhmRows = [];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    bhmRows.push({ lineIndex: i + 1, cols });
  }
}

console.log(`Total 배현명 rows: ${bhmRows.length}`);

// Check fill rates for the 16 target columns
const targetCols = [
  { idx: 2, name: '회사명' },
  { idx: 3, name: '사업자번호' },
  { idx: 4, name: '대표자' },
  { idx: 5, name: '우편번호' },
  { idx: 6, name: '주소' },
  { idx: 7, name: '전화번호' },
  { idx: 8, name: '팩스번호' },
  { idx: 9, name: '홈페이지' },
  { idx: 10, name: '이메일' },
  { idx: 14, name: '종업원수' },
  { idx: 17, name: '업종(NICE BizINFO)' },
  { idx: 24, name: '법인번호' },
  { idx: 30, name: '결산월' },
  { idx: 47, name: '업종_대' },
  { idx: 48, name: '업종_중' },
  { idx: 49, name: '업종_소' },
  { idx: 1, name: '비고(폐업 등)' }
];

const stats = {};
targetCols.forEach(t => stats[t.idx] = { name: t.name, filled: 0, empty: 0 });

let closedCount = 0;

bhmRows.forEach(r => {
  if (r.cols[1] === '폐업') closedCount++;
  targetCols.forEach(t => {
    const val = r.cols[t.idx];
    if (val && val.trim()) stats[t.idx].filled++;
    else stats[t.idx].empty++;
  });
});

console.log('\n--- 16개 핵심 열 검증 및 기입 현황 (총 1,000행) ---');
targetCols.forEach(t => {
  const s = stats[t.idx];
  console.log(`${s.name}: ${s.filled}건 기입 완료 (${(s.filled / 1000 * 100).toFixed(1)}%)`);
});

console.log(`\n폐업 식별 기업: ${closedCount}건`);
