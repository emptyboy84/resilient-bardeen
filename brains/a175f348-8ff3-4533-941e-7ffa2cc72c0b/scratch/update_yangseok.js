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

function toCSVLine(cols) {
  return cols.map(col => {
    if (col === null || col === undefined) return '';
    const str = String(col);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

const masterPath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
const lines = fs.readFileSync(masterPath, 'utf8').split(/\r?\n/);

let targetIdx = 1827; // Line 1828
const cols = parseCSVLine(lines[targetIdx]);

cols[0] = '배현명';
cols[1] = ''; // 계속사업자
cols[2] = '양석엔지니어링';
cols[3] = '6052724221';
cols[4] = '양무석';
cols[5] = '46981';
cols[6] = '부산광역시 사상구 낙동대로 910 (감전동)';
cols[7] = '051-316-7106';
cols[11] = '개인과세사업자';
cols[17] = '기타 엔지니어링 서비스업';
cols[23] = '6052724221';
cols[30] = '12월';
cols[47] = '전문, 과학 및 기술 서비스업';
cols[48] = '건축 기술, 엔지니어링 및 기타 과학기술 서비스업';
cols[49] = '건축 기술, 엔지니어링 및 관련 기술 서비스업';

lines[targetIdx] = toCSVLine(cols);
fs.writeFileSync(masterPath, lines.join('\r\n'), 'utf8');

console.log('Updated Line 1828 (양석엔지니어링) successfully.');

// Export excel
const { execSync } = require('child_process');
execSync('node "C:\\Users\\lg\\.gemini\\antigravity\\brain\\a175f348-8ff3-4533-941e-7ffa2cc72c0b\\scratch\\safe_export.js"', { stdio: 'inherit' });
