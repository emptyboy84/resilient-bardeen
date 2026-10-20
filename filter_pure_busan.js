const fs = require('fs');

const step1 = JSON.parse(fs.readFileSync('step1_results.json', 'utf8'));
const list = Object.values(step1);
const busan051 = list.filter(r => r.phone && r.phone.startsWith('051-'));
console.log('Total newly found pure 051 Busan numbers:', busan051.length);

let md = '| 순번 | 기업명 | 대표자명 | 사업자번호 | 부산 전화번호 (051) | 주소 |\n';
md += '| :---: | :--- | :---: | :---: | :---: | :--- |\n';
busan051.forEach(item => {
  md += `| ${item.seq} | ${item.name} | ${item.ceo} | ${item.bizNo} | **${item.phone}** | ${item.address} |\n`;
});
fs.writeFileSync('pure_busan_051_table.md', md, 'utf8');
console.log('Saved pure_busan_051_table.md');
