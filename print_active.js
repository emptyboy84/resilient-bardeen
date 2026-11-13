const fs = require('fs');
const list = JSON.parse(fs.readFileSync('active_701_1000.json', 'utf8'));
console.log('Total active targets:', list.length);
list.forEach((item, idx) => {
  console.log(`[${idx+1}] Seq ${item.seq} (Row ${item.r}) | ${item.name} | 대표: ${item.ceo} | 사번: ${item.bno} | ${item.addr.slice(0, 40)}`);
});
