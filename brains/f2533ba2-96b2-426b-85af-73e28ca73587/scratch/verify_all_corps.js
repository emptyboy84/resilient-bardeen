const fs = require('fs');

const lines = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/f2533ba2-96b2-426b-85af-73e28ca73587/scratch/input_batch.tsv', 'utf-8')
  .split('\n')
  .filter(l => l.trim().length > 0);

const results = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/f2533ba2-96b2-426b-85af-73e28ca73587/scratch/corps_found_results.json', 'utf-8'));

// Map of manually verified / extra found:
const extraFound = {
  '7658500671': { corpNo: '184511-0001252', note: '화승코퍼레이션 본점 법인번호' },
  '7688801078': { corpNo: '110111-7003140', note: '미르내이앤씨 본사 등기' },
  '7698101503': { corpNo: '180111-0676172', note: '(주)씨에스물류 본점 법인번호' },
  '7698601439': { corpNo: '180111-1241742', note: '(주)리콘 (원사업자 796-86 오기 수정)' },
  '7738501012': { corpNo: '180111-0853390', note: '(주)강봉천흡선 본점 법인번호' }
};

function isValidCorpNo(corpNo) {
  if (!corpNo) return false;
  const clean = corpNo.replace(/[^0-9]/g, '');
  if (clean.length !== 13) return false;
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(clean[i]) * weights[i];
  }
  const remainder = sum % 10;
  const checkDigit = (10 - remainder) % 10;
  return Number(clean[12]) === checkDigit;
}

// Compile complete lookup map for 81 corps
const corpMap = new Map();
results.forEach(r => {
  if (r.foundCorpNo && r.valid) {
    corpMap.set(r.bizno, { corpNo: r.foundCorpNo, note: '공식 데이터베이스(Bizno)' });
  }
});

for (const [bizno, data] of Object.entries(extraFound)) {
  corpMap.set(bizno, data);
}

console.log('Total verified corps with number:', corpMap.size);

// Validate all
corpMap.forEach((v, k) => {
  const valid = isValidCorpNo(v.corpNo);
  if (!valid) console.log('INVALID:', k, v);
});
console.log('All checksums checked!');
