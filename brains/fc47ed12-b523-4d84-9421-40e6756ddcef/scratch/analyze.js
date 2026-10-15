const fs = require('fs');
const content = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/input_raw.txt', 'utf8');
const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
console.log('Total lines:', lines.length);

lines.slice(0, 10).forEach((line, i) => {
  const parts = line.split('\t');
  console.log('Line ' + i + ' (' + parts.length + ' cols): ' + JSON.stringify(parts));
});
