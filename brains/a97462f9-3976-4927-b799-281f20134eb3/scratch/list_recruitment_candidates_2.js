const fs = require('fs');

const candidates = JSON.parse(
  fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/recruitment_search_candidates.json', 'utf8')
);

candidates.slice(30, 64).forEach((c, i) => {
  console.log(`${i+31}. [Row ${c.rowNum}] ${c.name} | Biz: ${c.biz} | CEO: ${c.ceo} | Addr: ${c.addr}`);
});
