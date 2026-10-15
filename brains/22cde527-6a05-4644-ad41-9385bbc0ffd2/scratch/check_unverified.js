const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const missing = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'missing_421.json'), 'utf8'));
const results = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'verified_results.json'), 'utf8'));

const unverified = missing.filter(m => !results[String(m.rowNumber)] || results[String(m.rowNumber)].bizno === null);
console.log(`Total unverified companies remaining: ${unverified.length}`);

console.log('\nSample 30 unverified companies:');
unverified.slice(0, 30).forEach((u, i) => {
    console.log(`[${i+1}] Row ${u.rowNumber} | "${u.name}" | 대표: "${u.ceo}" | 주소: "${u.address}" | 업종: "${u.category}"`);
});
