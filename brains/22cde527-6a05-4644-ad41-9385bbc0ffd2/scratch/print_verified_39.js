const fs = require('fs');
const list = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/strictly_verified_pass1.json', 'utf8'));

console.log(`Total: ${list.length}`);
list.forEach((x, i) => {
  console.log(`${i+1}. Row ${x.rowNumber} [${x.name}] -> ${x.bizno} | ${x.strictProof} | Tel: ${x.foundPhone || 'N/A'} | Emp: ${x.emp || 'N/A'}`);
});
