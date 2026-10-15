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

const mapFiles = [
  'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_네이버지도_카카오맵_전화번호검증리포트.csv',
  'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_전화실사_통화검증_콜시트.csv',
  'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_18컬럼_최종검증완료.csv',
  'C:\\Users\\lg\\Desktop\\오늘\\배현명_실사DB_검증완료_최신.csv'
];

mapFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l.trim());
    console.log(`\nFile: ${f}`);
    console.log(`  Lines: ${lines.length}`);
    console.log(`  Header: ${lines[0]}`);
    if (lines.length > 1) {
      console.log(`  Sample 1: ${lines[1]}`);
    }
  } else {
    console.log(`File NOT found: ${f}`);
  }
});
