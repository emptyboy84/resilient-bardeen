const fs = require('fs');
const https = require('https');

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

const masterPath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
const lines = fs.readFileSync(masterPath, 'utf8').split(/\r?\n/);

let targetLine = -1;
let currentCols = null;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('6052724221') || lines[i].includes('양석엔지니어링')) {
    targetLine = i + 1;
    currentCols = parseCSVLine(lines[i]);
    break;
  }
}

console.log(`Target in CSV: Line ${targetLine}`);
console.log('Current CSV Row:', currentCols);

// Fetch Bizno info
const url = 'https://bizno.net/article/6052724221';
https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`\nBizno Fetch Status: ${res.statusCode}`);
    const descMatch = data.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    if (descMatch) {
      console.log('Meta Description:', descMatch[1]);
    }
  });
});
