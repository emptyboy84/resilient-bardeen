const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const blanks = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'exact_blanks_229.json'), 'utf8'));

const catCounts = {};
let withCeo = 0, withPhone = 0, withAddr = 0;

for (const b of blanks) {
  catCounts[b.category] = (catCounts[b.category] || 0) + 1;
  if (b.ceo) withCeo++;
  if (b.phone) withPhone++;
  if (b.address) withAddr++;
}

console.log('Total blanks:', blanks.length);
console.log('With CEO:', withCeo);
console.log('With Phone:', withPhone);
console.log('With Address:', withAddr);
console.log('Category breakdown:', catCounts);
