const fs = require('fs');

const raw = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\a175f348-8ff3-4533-941e-7ffa2cc72c0b\\scratch\\block2_results.json', 'utf8');
const results = JSON.parse(raw);

console.log(`Total analyzed: ${results.length}`);

let matchedCount = 0;
let closedCount = 0;
let corpCount = 0;

results.forEach(r => {
  if (r.fetched) {
    matchedCount++;
    if (r.fetched.state === '폐업') closedCount++;
    if (r.fetched.corpNo) corpCount++;
  }
});

console.log(`Successfully fetched from live DB: ${matchedCount}/${results.length} (${(matchedCount/results.length*100).toFixed(1)}%)`);
console.log(`Closed businesses (폐업): ${closedCount}`);
console.log(`Corporations with Corp Reg No (법인): ${corpCount}`);

console.log('\n--- Sample of rows 1090 to 1105 ---');
results.filter(r => r.lineNum >= 1090 && r.lineNum <= 1105).forEach(r => {
  const f = r.fetched || {};
  console.log(`[Line ${r.lineNum}] ${r.company} (${r.bizNo})`);
  console.log(`  상태(비고): ${f.state || '정상'}`);
  console.log(`  대표자: ${f.rep || r.currentCols[4] || '-'}`);
  console.log(`  우편번호: ${f.zipCode || r.currentCols[5] || '-'}`);
  console.log(`  주소: ${f.address || r.currentCols[6] || '-'}`);
  console.log(`  전화번호: ${f.phone || r.currentCols[7] || '-'}`);
  console.log(`  팩스번호: ${f.fax || r.currentCols[8] || '-'}`);
  console.log(`  홈페이지: ${f.homepage || r.currentCols[9] || '-'}`);
  console.log(`  종업원수: ${f.employees || r.currentCols[14] || '-'}`);
  console.log(`  업종(NICE): ${f.niceBizInfo || r.currentCols[17] || '-'}`);
  console.log(`  법인번호: ${f.corpNo || r.currentCols[24] || '-'}`);
  console.log(`  결산월: ${f.closingMonth || r.currentCols[30] || '-'}`);
  console.log(`  업종 대/중/소: ${f.industryDae || '-'} > ${f.industryJung || '-'} > ${f.industrySo || '-'}`);
  console.log('');
});
