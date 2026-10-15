const fs = require('fs');
const path = require('path');

const rawFile = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/input_raw.txt';
const cacheDir = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/cache';

const lines = fs.readFileSync(rawFile, 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);

const notFound = [];

lines.forEach((line, idx) => {
  const parts = line.split('\t');
  const bno = (parts[3] || '').replace(/[^0-9]/g, '');
  const cachePath = path.join(cacheDir, `${bno}.html`);
  let found = false;
  if (fs.existsSync(cachePath)) {
    const html = fs.readFileSync(cachePath, 'utf8');
    if (!html.includes('사업자 정보가 없습니다') && (html.includes('table_guide01') || html.includes('titles'))) {
      found = true;
    }
  }
  if (!found) {
    notFound.push({ idx, name: parts[2], bno, rep: parts[4], addr: parts[6] });
  }
});

console.log(`Total not found: ${notFound.length}`);
console.log(JSON.stringify(notFound, null, 2));
