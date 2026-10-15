const fs = require('fs');

const outFile = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/output.tsv';
const content = fs.readFileSync(outFile, 'utf8');
const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);

console.log(`Total output lines: ${lines.length}`);

let hasStar = 0;
lines.forEach((l, i) => {
  const cols = l.split('\t');
  if (cols.length !== 18) {
    console.log(`Line ${i} has ${cols.length} cols instead of 18`);
  }
  cols.forEach((c, ci) => {
    if (c.includes('*')) {
      console.log(`Line ${i} Col ${ci} has star: "${c}"`);
      hasStar++;
    }
  });
});

console.log(`Total stars found: ${hasStar}`);

// Sample print first 15 lines
lines.slice(0, 15).forEach((l, i) => {
  console.log(`[Row ${i}]: ${l}`);
});
