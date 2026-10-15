const fs = require('fs');

const outFile = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/output.tsv';
const lines = fs.readFileSync(outFile, 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);

console.log(`Auditing ${lines.length} lines...`);

const issues = [];

lines.forEach((line, idx) => {
  const c = line.split('\t');
  if (c.length !== 18) {
    issues.push(`Row ${idx}: wrong col count ${c.length}`);
  }
  // Check stars
  for (let i = 0; i < c.length; i++) {
    if (c[i].includes('*')) {
      issues.push(`Row ${idx} Col ${i}: has star: "${c[i]}"`);
    }
  }
  // Check phone
  if (c[7] && (c[7].includes('000-0000') || c[7].length < 8)) {
    issues.push(`Row ${idx} Col 7 (tel): suspicious tel "${c[7]}"`);
  }
  if (c[8] && (c[8].includes('000-0000') || c[8].length < 8)) {
    issues.push(`Row ${idx} Col 8 (fax): suspicious fax "${c[8]}"`);
  }
  // Check URL
  if (c[9]) {
    if (!c[9].includes('.') || c[9].endsWith('/.') || c[9].length < 8) {
      issues.push(`Row ${idx} Col 9 (url): suspicious url "${c[9]}"`);
    }
  }
  // Check email
  if (c[10]) {
    if (!c[10].includes('@') || !c[10].includes('.')) {
      issues.push(`Row ${idx} Col 10 (email): suspicious email "${c[10]}"`);
    }
  }
  // Check address
  if (c[6] === '비공개' || c[6] === '-') {
    issues.push(`Row ${idx} Col 6 (addr): invalid addr "${c[6]}"`);
  }
});

console.log(`Found ${issues.length} issues:`);
console.log(issues.slice(0, 30));
