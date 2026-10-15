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

let missingPhone = 0;
let missingHP = 0;
let missingFax = 0;
let missingEmail = 0;
let missingRep = 0;
let missingAddr = 0;
let missingZip = 0;

const missingPhoneList = [];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  if (cols[0] === '배현명') {
    if (!cols[4]) missingRep++;
    if (!cols[5]) missingZip++;
    if (!cols[6]) missingAddr++;
    if (!cols[7]) {
      missingPhone++;
      if (missingPhoneList.length < 20) {
        missingPhoneList.push({ line: i + 1, name: cols[2], bizNo: cols[3], rep: cols[4] });
      }
    }
    if (!cols[8]) missingFax++;
    if (!cols[9]) missingHP++;
    if (!cols[10]) missingEmail++;
  }
}

console.log(`Missing Rep: ${missingRep}`);
console.log(`Missing Zip: ${missingZip}`);
console.log(`Missing Addr: ${missingAddr}`);
console.log(`Missing Phone: ${missingPhone}`);
console.log(`Missing Fax: ${missingFax}`);
console.log(`Missing HP: ${missingHP}`);
console.log(`Missing Email: ${missingEmail}`);
console.log('\nSample missing phone companies:', missingPhoneList.slice(0, 10));
