const fs = require('fs');

const inputFile = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/input_batch.tsv';
const lines = fs.readFileSync(inputFile, 'utf-8').split(/\r?\n/).filter(l => l.trim().length > 0);

const list = lines.map((l, idx) => {
  const p = l.split('\t');
  let company = p[2]?.trim() || '';
  let bizno = p[3]?.trim() || '';
  let rep = p[4]?.trim() || '';
  if (rep === '"' && p[5]?.includes('"')) {
    rep = p[5].replace(/"/g, '').trim();
  }
  let addr = '';
  for (let c = 5; c <= 7; c++) {
    const v = p[c]?.trim() || '';
    if (v && (v.includes('시') || v.includes('군') || v.includes('도') || v.includes('로') || v.includes('길'))) {
      if (!addr) addr = v;
    }
  }

  return {
    idx: idx + 1,
    bizno,
    name: company,
    rep,
    addr
  };
});

fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/companies_to_query.json', JSON.stringify(list, null, 2), 'utf-8');
console.log('Saved', list.length, 'companies to companies_to_query.json');
