const fs = require('fs');

const targets = JSON.parse(
  fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/blue_missing_sales_targets.json', 'utf8')
);

const after2100 = targets.filter(t => t.rowNum >= 2100 && t.biz && t.biz.trim().length >= 10);
console.log(`Blue missing sales with valid biz after Row 2100: ${after2100.length}`);

after2100.forEach((t, i) => {
  console.log(`${i+1}. Row ${t.rowNum}: [${t.name}] Biz: [${t.biz}] Cat: [${t.cat}] CEO: [${t.ceo}]`);
});
