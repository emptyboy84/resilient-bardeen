const fs = require('fs');

function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField);
      if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
  }
  return rows;
}

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const clean = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
const rows = parseCSV(clean);

const blueTargets = JSON.parse(
  fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/blue_missing_sales_targets.json', 'utf8')
);

// Check which blue targets still lack sales in the updated CSV
const stillMissingSales = [];

blueTargets.forEach(t => {
  const r = rows[t.rowNum - 1];
  if (!r) return;
  const s24 = r[16] ? r[16].trim() : '';
  const s25 = r[17] ? r[17].trim() : '';
  if (!s24 && !s25) {
    stillMissingSales.push({
      rowNum: t.rowNum,
      name: r[2] || t.name,
      biz: r[3] || t.biz,
      ceo: r[6] || t.ceo,
      phone: r[7] || t.phone,
      addr: r[10] || t.addr,
      cat: r[11] || t.cat
    });
  }
});

console.log(`Blue targets still lacking sales: ${stillMissingSales.length}`);

// Group by priority: Corporations with valid biz numbers first
const withBiz = stillMissingSales.filter(t => t.biz && t.biz.replace(/-/g, '').length === 10);
console.log(`- With valid 10-digit biz number: ${withBiz.length}`);

// Corporate keywords
const corps = withBiz.filter(t => {
  const n = t.name;
  return n.includes('주식회사') || n.includes('(주)') || n.includes('코리아') || n.includes('엔터') || n.includes('미디어') || n.includes('랩') || n.includes('소프트') || n.includes('테크') || n.includes('시스템') || n.includes('에듀') || n.includes('커뮤니케이션') || n.includes('디자인') || n.includes('출판');
});

console.log(`- High priority corporate candidates for recruitment site search: ${corps.length}`);

fs.writeFileSync(
  'C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/recruitment_search_candidates.json',
  JSON.stringify(corps, null, 2),
  'utf8'
);

console.log('Saved to scratch/recruitment_search_candidates.json');
