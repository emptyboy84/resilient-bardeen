const fs = require('fs');
const list = JSON.parse(fs.readFileSync('active_1001_1300.json', 'utf8'));
list.slice(85, 120).forEach((item, idx) => {
  console.log(`[${idx+86}] Seq ${item.seq} (Row ${item.r}) | ${item.name} | 대표: ${item.ceo} | 사번: ${item.bno} | ${item.addr.slice(0, 35)}`);
});
