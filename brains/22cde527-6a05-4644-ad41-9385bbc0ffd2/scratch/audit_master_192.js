const fs = require('fs');

const master = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/master_verified_194.json', 'utf8'));

console.log('Total verified:', master.length);

function isValidBizNo(b) {
  if (!b) return false;
  const clean = b.replace(/[^0-9]/g, '');
  if (clean.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(clean[i]) * weights[i];
  const d9 = Number(clean[8]) * 5;
  sum += Math.floor(d9 / 10) + (d9 % 10);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(clean[9]);
}

let invalidBiz = 0;
let withYear = 0;
let withMonth = 0;
let withCeo = 0;
let withTel = 0;
let withFax = 0;
let withEmp = 0;
let withClose = 0;
let withSource = 0;

master.forEach(m => {
  if (!isValidBizNo(m.bizno)) {
    console.log(`INVALID BIZNO at Row ${m.rowNumber} [${m.name}]: ${m.bizno}`);
    invalidBiz++;
  }
  if (m.year) withYear++;
  if (m.month) withMonth++;
  if (m.ceo) withCeo++;
  if (m.tel) withTel++;
  if (m.fax) withFax++;
  if (m.emp) withEmp++;
  if (m.closeDate) withClose++;
  if (m.source) withSource++;
});

console.log({
  total: master.length,
  invalidBiz,
  withYear,
  withMonth,
  withCeo,
  withTel,
  withFax,
  withEmp,
  withClose,
  withSource
});
