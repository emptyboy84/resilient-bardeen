const fs = require('fs');
const results = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/f2533ba2-96b2-426b-85af-73e28ca73587/scratch/corps_found_results.json', 'utf-8'));
const found = results.filter(r => r.foundCorpNo && r.valid);
const notFound = results.filter(r => !r.foundCorpNo || !r.valid);
console.log('Found & Valid count:', found.length);
console.log('Not found count:', notFound.length);
console.log('\n--- Not found list ---');
notFound.forEach(n => {
  console.log(`[${n.rowNo}] ${n.company} | 사업자:${n.bizno} | 유형:${n.bizType} | 대표:${n.rep}`);
});
