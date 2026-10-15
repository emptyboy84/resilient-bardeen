const fs = require('fs');
const content = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/output.tsv', 'utf8');
const lines = content.split('\n').filter(l => l.trim().length > 0);
console.log('Lines count:', lines.length);

[0, 10, 50, 100, 200, 300, 400, 499].forEach(i => {
  console.log('--- Row ' + i + ' ---');
  console.log(lines[i]);
});
