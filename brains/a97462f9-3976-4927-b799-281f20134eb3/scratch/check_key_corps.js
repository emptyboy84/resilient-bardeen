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

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(content);

const testNames = [
  '운도게임스튜디오', '비바몬스터', '와라봐라', '조은글방', '엠에스네트워크', '스튜디오바다', '스튜디오더블린',
  '삼주', '넥슨커뮤니케이션즈', '유티플러스', '큐로드', '코시', '파크이에스엠', '블루솜', '늘아이엔씨', '포텐츠', '빅잼', '숲과교육'
];

console.log('=== Checking Key Companies in CSV ===');
rows.slice(1).forEach((r, idx) => {
  const name = r[2] ? r[2].trim() : '';
  for (const t of testNames) {
    if (name.includes(t)) {
      console.log(`Row ${idx + 2} [${name}] | Biz: [${r[3]}] | 24매출: [${r[16]}] | 25매출: [${r[17]}] | 비고: [${r[14]}]`);
    }
  }
});
