const fs = require('fs');

const inputFile = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/input_batch.tsv';
const cacheFile = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/bizno_200_cache.json';

const lines = fs.readFileSync(inputFile, 'utf-8').split(/\r?\n/).filter(l => l.trim().length > 0);
const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));

console.log('Total input rows:', lines.length);
console.log('Cached keys:', Object.keys(cache).length);

let closedCount = 0;
let zipCount = 0;
let empCount = 0;
let missingZip = [];

lines.forEach((l, idx) => {
  const p = l.split('\t');
  const bizno = p[3]?.trim();
  const c = cache[bizno] || {};
  
  if (c.status === '폐업' || p[1]?.trim() === '폐업' || l.includes('\t폐업\t')) closedCount++;
  if (c.zip) zipCount++;
  else missingZip.push({ idx: idx + 1, company: p[2]?.trim(), bizno, addr: p[6]?.trim() });
  if (c.employees) empCount++;
});

console.log('폐업자 수:', closedCount);
console.log('우편번호 확보 수:', zipCount, '/ 200');
console.log('종업원수 확보 수:', empCount, '/ 200');
console.log('Missing zip count:', missingZip.length);
if (missingZip.length > 0) {
  console.log('First 5 missing zip:', missingZip.slice(0, 5));
}
