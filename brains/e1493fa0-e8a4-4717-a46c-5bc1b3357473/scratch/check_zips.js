const fs = require('fs');
const lines = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/input_batch.tsv', 'utf-8').split(/\r?\n/).filter(l => l.trim().length > 0);

let hasZip = 0;
let noZip = 0;
const addrs = [];

lines.forEach((l, i) => {
  const p = l.split('\t');
  let addr = '';
  let zip = '';
  for (let c = 4; c <= 7; c++) {
    const v = p[c]?.trim() || '';
    if (/^\d{5}$/.test(v)) zip = v;
    if (v.includes('시') || v.includes('군') || v.includes('구') || v.includes('도') || v.includes('로') || v.includes('길')) {
      if (!addr) addr = v;
    }
  }
  if (zip) hasZip++;
  else noZip++;
  addrs.push({ i: i + 1, company: p[2]?.trim(), addr, zip });
});

console.log('Has zip:', hasZip, 'No zip:', noZip);
console.log('Sample addrs without zip (first 10):');
addrs.filter(a => !a.zip).slice(0, 10).forEach(a => console.log('[' + a.i + '] ' + a.company + ': ' + a.addr));
