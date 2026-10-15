const fs = require('fs');

const targets = JSON.parse(
  fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/blue_missing_sales_targets.json', 'utf8')
);

// Look for corporate entities (주식회사, (주), etc.) or distinct IT/CT names
const corps = targets.filter(t => {
  const n = t.name;
  return n.includes('주식회사') || n.includes('(주)') || n.includes('코리아') || n.includes('엔터') || n.includes('미디어') || n.includes('랩') || n.includes('소프트') || n.includes('테크') || n.includes('시스템');
});

console.log(`Interesting CT/IT corporate targets: ${corps.length}`);
corps.slice(0, 30).forEach((t, i) => {
  console.log(`${i+1}. Row ${t.rowNum}: [${t.name}] Biz: [${t.biz}] Cat: [${t.cat}] CEO: [${t.ceo}] Phone: [${t.phone}] Addr: [${t.addr}]`);
});
