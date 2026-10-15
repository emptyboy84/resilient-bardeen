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

let targetIdx = 1850; // Line 1851
const cols = parseCSVLine(lines[targetIdx]);

cols[0] = '배현명';
cols[1] = ''; // 정상 가동
cols[2] = '㈜비씨에스';
cols[3] = '1746600229'; // 또는 8648102100
cols[4] = '도현우';
cols[5] = '46971';
cols[6] = '부산광역시 사상구 광장로 20, 3층 302호 (괘법동, 미래로빌딩)';
cols[7] = '051-711-3557'; // 직통전화 (대표번호 1544-1633 병행 가능)
cols[9] = 'https://best-cs.kr'; // 공식 홈페이지
cols[11] = '영리법인';
cols[12] = '2021.03.16';
cols[14] = '10명';
cols[17] = '그 외 기타 달리 분류되지 않은 개인 서비스업';
cols[23] = '1746600229';
cols[30] = '12월';
cols[47] = '협회 및 단체, 수리 및 기타 개인 서비스업';
cols[48] = '기타 개인 서비스업';
cols[49] = '그 외 기타 개인 서비스업';

lines[targetIdx] = toCSVLine(cols);
fs.writeFileSync(masterPath, lines.join('\r\n'), 'utf8');

console.log('Updated Line 1851 (비씨에스) successfully.');

// Export excel
const { execSync } = require('child_process');
execSync('node "C:\\Users\\lg\\.gemini\\antigravity\\brain\\a175f348-8ff3-4533-941e-7ffa2cc72c0b\\scratch\\safe_export.js"', { stdio: 'inherit' });
