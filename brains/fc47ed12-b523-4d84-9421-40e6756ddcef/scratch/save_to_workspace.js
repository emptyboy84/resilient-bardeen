const fs = require('fs');
const src = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/output.tsv';
const destTsv = 'c:/Users/lg/resilient-bardeen/bizno_filtered_result.tsv';
const destCsv = 'c:/Users/lg/resilient-bardeen/bizno_filtered_result.csv';

const content = fs.readFileSync(src, 'utf8');
fs.writeFileSync(destTsv, content, 'utf8');

const lines = content.split('\n').filter(l => l.trim().length > 0);
const csvLines = lines.map(line => {
  const cols = line.split('\t');
  return cols.map(c => '"' + c.replace(/"/g, '""') + '"').join(',');
});
fs.writeFileSync(destCsv, '\uFEFF' + csvLines.join('\r\n'), 'utf8');

console.log('Saved ' + lines.length + ' rows to ' + destTsv + ' and ' + destCsv);
