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

let targetIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('6078260940') || lines[i].includes('글로벌도시')) {
    targetIdx = i;
    break;
  }
}

if (targetIdx !== -1) {
  console.log(`Found target at index ${targetIdx} (Line ${targetIdx + 1})`);
  const cols = parseCSVLine(lines[targetIdx]);
  console.log('Before:', cols);

  cols[0] = '배현명';
  cols[1] = ''; // 정상 가동
  cols[2] = '글로벌도시 관광진흥기구';
  cols[3] = '6078260940';
  cols[4] = '우경하';
  cols[5] = '46523';
  cols[6] = '부산광역시 북구 금곡대로 357 (금곡동) 2,4층';
  cols[7] = '051-502-1967'; // 직통 대표전화 (051-507-0044 병기 가능)
  cols[8] = '051-502-1968'; // 팩스
  cols[9] = 'http://www.aptpo.org'; // 공식 홈페이지
  cols[10] = 'secretariat@aptpo.org'; // 대표 이메일
  cols[14] = '8명';
  cols[17] = '그 외 기타 협회 및 단체';
  cols[23] = '6078260940';
  cols[30] = '12월';
  cols[47] = '사업시설 관리, 사업 지원 및 임대 서비스업';
  cols[48] = '사업 지원 서비스업';
  cols[49] = '기타 사업 지원 서비스업';

  lines[targetIdx] = toCSVLine(cols);
  fs.writeFileSync(masterPath, lines.join('\r\n'), 'utf8');
  console.log('Updated Line 1825 successfully.');

  // Regenerate highlighted Excel
  const { execSync } = require('child_process');
  execSync('node "C:\\Users\\lg\\.gemini\\antigravity\\brain\\a175f348-8ff3-4533-941e-7ffa2cc72c0b\\scratch\\generate_orange_excel.js"', { stdio: 'inherit' });
} else {
  console.log('Target not found!');
}
