const fs = require('fs');

const parsedInput = JSON.parse(fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\scratch\\parsed_input.json', 'utf8')).slice(0, 58);

function validateChecksum(corpNo) {
  const clean = (corpNo || '').replace(/[^0-9]/g, '');
  if (clean.length !== 13) return false;
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(clean[i], 10) * weights[i];
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(clean[12], 10);
}

console.log('--- CORPORATE NUMBERS LIST (58 ROWS) ---');
let corpCount = 0;
parsedInput.forEach(r => {
  if (r.corpNo) {
    corpCount++;
    const isValid = validateChecksum(r.corpNo);
    console.log(`[Row ${r.rowIdx}] ${r.name} | BizNo: ${r.bizNo} | CorpNo: ${r.corpNo} | Checksum: ${isValid ? 'PASS' : 'FAIL'}`);
  }
});
console.log(`Total corporate numbers present: ${corpCount}`);
