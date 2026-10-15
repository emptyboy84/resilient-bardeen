const fs = require('fs');
const file = 'C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/input_batch.tsv';
const lines = fs.readFileSync(file, 'utf-8').split('\n').filter(l => l.trim().length > 0);

console.log('Total rows:', lines.length);

for (let idx = 0; idx < Math.min(10, lines.length); idx++) {
  const parts = lines[idx].split('\t');
  console.log(`[Row ${idx+1}] (cols: ${parts.length})`);
  parts.forEach((p, i) => {
    if (p.trim().length > 0) {
      console.log(`   col ${i}: ${p.trim()}`);
    }
  });
}
