const fs = require('fs');
const targets = JSON.parse(fs.readFileSync('remaining_1301_end.json', 'utf8'));

const corps = targets.filter(t => 
  t.name.includes('(주)') || 
  t.name.includes('주식회사') || 
  t.name.includes('(유한)') || 
  t.name.includes('(유책)') || 
  t.name.includes('스튜디오') || 
  t.name.includes('랩') || 
  t.name.includes('미디어') ||
  t.name.includes('소프트') ||
  (t.corpNo && t.corpNo.length > 5)
);

console.log('Total remaining missing targets:', targets.length);
console.log('Major Corporate/Studio targets:', corps.length);
fs.writeFileSync('major_corps_remaining.json', JSON.stringify(corps, null, 2), 'utf8');

corps.slice(0, 15).forEach((c, i) => {
  console.log(`[${i+1}] Seq ${c.seq} (Row ${c.r}) | ${c.name} | ${c.ceo} | ${c.bno} | ${c.addr.slice(0, 30)}`);
});
