const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\lg\\Desktop\\Today';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));

for (const f of files) {
  try {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    if (content.includes('동화사') || content.includes('464-0761')) {
      console.log('=== MATCH FILE:', f, '===');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('동화사') || line.includes('464-0761')) {
          console.log(`[Line ${idx+1}]`, line.trim());
        }
      });
    }
  } catch (e) {
    // try euc-kr or binary
  }
}
