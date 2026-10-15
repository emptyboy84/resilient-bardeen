const fs = require('fs');

const targets = JSON.parse(
  fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/blue_missing_sales_targets.json', 'utf8')
);

console.log(`Total missing sales targets: ${targets.length}`);
const withBiz = targets.filter(t => t.biz && t.biz.trim().length >= 10);
console.log(`With valid biz: ${withBiz.length}`);

console.log('\n--- Sample 40 corps with valid biz ---');
withBiz.slice(0, 40).forEach((t, i) => {
  console.log(`${i+1}. Row ${t.rowNum}: [${t.name}] Biz: [${t.biz}] Cat: [${t.cat}] CEO: [${t.ceo}] Phone: [${t.phone}]`);
});
