const fs = require('fs');
const path = require('path');

const rawFile = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/input_raw.txt';
const cacheDir = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/cache';

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

const lines = fs.readFileSync(rawFile, 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);
console.log(`Loaded ${lines.length} lines from input`);

const rows = lines.map((line, idx) => {
  const parts = line.split('\t');
  return {
    idx,
    name: parts[2] || '',
    bno: (parts[3] || '').replace(/[^0-9]/g, '')
  };
});

async function fetchBizno(bno) {
  if (!bno || bno.length !== 10) return;
  const cachePath = path.join(cacheDir, `${bno}.html`);
  if (fs.existsSync(cachePath) && fs.statSync(cachePath).size > 500) {
    return;
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      
      const res = await fetch(`https://bizno.net/article/${bno}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });
      clearTimeout(timeoutId);
      
      const text = await res.text();
      fs.writeFileSync(cachePath, text, 'utf8');
      return;
    } catch (e) {
      if (attempt === 2) {
        console.error(`Failed ${bno} after 3 attempts: ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

async function runPool() {
  const concurrency = 15;
  let cursor = 0;
  let completed = 0;
  const total = rows.length;
  const startTime = Date.now();

  async function worker() {
    while (cursor < total) {
      const item = rows[cursor++];
      await fetchBizno(item.bno);
      completed++;
      if (completed % 25 === 0 || completed === total) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[${elapsed}s] Progress: ${completed}/${total} (${((completed/total)*100).toFixed(1)}%)`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  console.log(`Finished fetching all in ${((Date.now() - startTime) / 1000).toFixed(1)}s!`);
}

runPool();
