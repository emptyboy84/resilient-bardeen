const fs = require('fs');
const path = require('path');

const file = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/revenue_found_saramin_v2.json';
const list = JSON.parse(fs.readFileSync(file, 'utf8'));

console.log('Total verified with revenue:', list.length);
console.log('----------------------------------------------------');
list.forEach((item, idx) => {
  console.log(`${idx + 1}. [Row ${item.rowNumber}] ${item.name}`);
  console.log(`   - 사업자번호: ${item.bizno}`);
  console.log(`   - 대표자: ${item.ceo}`);
  console.log(`   - 결산 매출액: ${item.rawRevenue} (${item.formattedWon}원)`);
  console.log(`   - 검증근거: ${item.matchReason}`);
  console.log(`   - 출처: ${item.saraminUrl}`);
  console.log('');
});
