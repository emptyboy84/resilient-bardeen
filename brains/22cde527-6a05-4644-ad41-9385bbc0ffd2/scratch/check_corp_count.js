const fs = require('fs');

const cache = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/details_cache_150.json', 'utf8'));

// Check how many are 주식회사 vs 개인
let corpCount = 0;
let indivCount = 0;

for (const [bizno, item] of Object.entries(cache)) {
  const name = item.companyName || '';
  if (name.includes('(주)') || name.includes('주식회사') || name.includes('(유)') || name.includes('유한회사')) {
    corpCount++;
  } else {
    indivCount++;
  }
}

console.log('Total:', Object.keys(cache).length);
console.log('Corporations (주식회사 등):', corpCount);
console.log('Individual/Other (개인 등):', indivCount);
