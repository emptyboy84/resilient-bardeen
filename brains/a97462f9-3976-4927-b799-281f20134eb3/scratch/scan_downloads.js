const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\lg\\Downloads';
const files = fs.readdirSync(dir);

console.log(`Scanning ${files.length} files in Downloads...`);

for (const f of files) {
  if (f.endsWith('.htm') || f.endsWith('.html') || f.endsWith('.csv') || f.endsWith('.json') || f.endsWith('.txt')) {
    try {
      const fullPath = path.join(dir, f);
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('동화사') || content.includes('464-0761')) {
        console.log(`[FOUND in ${f}]`);
        const lines = content.split('\n');
        lines.forEach(l => {
          if (l.includes('동화사') || l.includes('464-0761') || l.includes('초량')) {
            console.log('  ', l.trim().substring(0, 150));
          }
        });
      }
    } catch (e) {}
  }
}
console.log('Done scanning Downloads.');
