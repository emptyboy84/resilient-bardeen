const fs = require('fs');
const file = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/input_batch.tsv';
const raw = fs.readFileSync(file, 'utf-8');
const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);

console.log('Total raw lines:', lines.length);

const parsed = [];
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  // Handle tab splits
  let parts = line.split('\t');
  
  // Author
  let author = parts[0]?.trim() || '';
  let status = parts[1]?.trim() || '';
  let company = parts[2]?.trim() || '';
  let bizno = parts[3]?.trim() || '';
  
  // check if bizno matches 10 digits
  if (!/^\d{10}$/.test(bizno.replace(/[^0-9]/g, ''))) {
    // find where bizno is
    const bIndex = parts.findIndex((p, idx) => idx > 0 && /^\d{10}$/.test(p.replace(/[^0-9]/g, '')));
    if (bIndex !== -1) {
      // misalignment
      company = parts[bIndex - 1]?.trim() || '';
      bizno = parts[bIndex]?.trim() || '';
    }
  }
  
  parsed.push({
    row: i + 1,
    company,
    bizno: bizno.replace(/[^0-9]/g, ''),
    partsCount: parts.length,
    raw: line
  });
}

console.log('Parsed count:', parsed.length);
const badBizno = parsed.filter(p => p.bizno.length !== 10);
console.log('Bad bizno count:', badBizno.length);
if (badBizno.length > 0) {
  console.log('Sample bad biznos:', badBizno.slice(0, 5));
}
console.log('First 3:', parsed.slice(0, 3));
console.log('Last 3:', parsed.slice(-3));
