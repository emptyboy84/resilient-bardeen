const fs = require('fs');
const path = require('path');
const AdmZip = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/jszip');

const dir = 'C:\\Users\\lg\\Desktop\\Today';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));

console.log(`Scanning ${files.length} xlsx files in Today via fast string lookup...`);

async function fastScan() {
  for (const f of files) {
    try {
      const fullPath = path.join(dir, f);
      const buf = fs.readFileSync(fullPath);
      const zip = await AdmZip.loadAsync(buf);
      const ssFile = zip.file('xl/sharedStrings.xml');
      if (ssFile) {
        const text = await ssFile.async('string');
        if (text.includes('동화사') || text.includes('464-0761')) {
          console.log(`[FOUND in XLSX] ${f}`);
        }
      }
    } catch (e) {
      // ignore
    }
  }
  console.log('Fast scan finished.');
}

fastScan();
