const fs = require('fs');
const path = require('path');

function searchDir(dir, depth = 0) {
  if (depth > 4) return;
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (f === 'node_modules' || f === '.git' || f === 'brain_logs' || f === '.gemini' || f === 'OneDrive') continue;
      const full = path.join(dir, f);
      let stat;
      try {
        stat = fs.statSync(full);
      } catch (e) {
        continue;
      }
      if (stat.isDirectory()) {
        searchDir(full, depth + 1);
      } else if (f.endsWith('.tsv') || f.endsWith('.csv') || f.endsWith('.txt') || f.endsWith('.json') || f.endsWith('.md')) {
        try {
          const content = fs.readFileSync(full, 'utf8');
          if (content.includes('7103-2127') || content.includes('71032127')) {
            console.log('EXACT MATCH in:', full);
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
}

console.log('Searching in worktree...');
searchDir('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_missing_phone_number');
console.log('Searching in c:/Users/lg/resilient-bardeen...');
searchDir('C:/Users/lg/resilient-bardeen');
console.log('Done.');
