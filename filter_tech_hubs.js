const fs = require('fs');
const corps = JSON.parse(fs.readFileSync('major_corps_remaining.json', 'utf8'));

const techHubCorps = corps.filter(c => 
  c.addr.includes('센텀') || 
  c.addr.includes('금융로') || 
  c.addr.includes('BIFC') || 
  c.addr.includes('대학교') || 
  c.addr.includes('테크노') ||
  c.addr.includes('지식산업')
);

console.log('Tech Hub Corporations count:', techHubCorps.length);
fs.writeFileSync('tech_hub_corps.json', JSON.stringify(techHubCorps, null, 2), 'utf8');

techHubCorps.slice(0, 20).forEach((c, i) => {
  console.log(`[${i+1}] Seq ${c.seq} (Row ${c.r}) | ${c.name} | ${c.ceo} | ${c.bno} | ${c.addr.slice(0, 35)}`);
});
