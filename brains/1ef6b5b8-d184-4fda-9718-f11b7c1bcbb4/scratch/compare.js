const fs = require('fs');

const userRow = '배현명\t\t㈜미우디자인\t5518501580\t장준호\t06176\t서울특별시 강남구 영동대로 416 \t02-3484-7788\t02-3484-7789\t\t\t\t도배, 실내장식 및 내장 목공사업\t110111-2192526\t\t\t\t';
const userParts = userRow.split('\t');

console.log('User input col count:', userParts.length);
userParts.forEach((p, idx) => console.log(`User Col ${idx}: [${p}]`));

const lines = fs.readFileSync('merged_500_perfect.tsv', 'utf-8').trim().split('\n');
const row405 = lines[404].split('\t');
console.log('\nmerged_500_perfect.tsv row 405 col count:', row405.length);
row405.forEach((p, idx) => console.log(`Row 405 Col ${idx}: [${p}]`));

console.log('\nDifferences:');
const maxLen = Math.max(userParts.length, row405.length);
for (let i = 0; i < maxLen; i++) {
  const u = userParts[i] !== undefined ? userParts[i] : '(undefined)';
  const r = row405[i] !== undefined ? row405[i] : '(undefined)';
  if (u !== r) {
    console.log(`Col ${i} differs: User=[${u}] vs Current=[${r}]`);
  }
}
