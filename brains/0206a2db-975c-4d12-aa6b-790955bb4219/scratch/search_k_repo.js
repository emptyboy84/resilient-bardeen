const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\add_ace_hightech_data';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsv') || f.endsWith('.csv') || f.endsWith('.json'));

let found = false;
for (const file of files) {
  const filePath = path.join(dir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('8988802742') || content.includes('케이안전기술원')) {
      console.log('Found in file:', file);
      found = true;
      const lines = content.split('\n');
      lines.forEach((l, i) => {
        if (l.includes('8988802742') || l.includes('케이안전기술원')) {
          console.log(`Line ${i + 1}: ${l}`);
        }
      });
    }
  } catch (e) {
    console.error(file, e.message);
  }
}
if (!found) {
  console.log('Not found in any tsv/csv in root.');
}
