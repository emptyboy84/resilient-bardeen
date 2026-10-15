const https = require('https');

function searchDaum(q) {
  return new Promise(resolve => {
    https.get('https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const m = d.match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
        console.log(`[Daum] "${q}" biz matches:`, [...new Set(m)]);
        const snips = d.match(/.{0,40}브이알코리아.{0,60}/g) || [];
        snips.slice(0, 3).forEach(s => console.log(' - ' + s.replace(/<[^>]+>/g, ' ')));
        resolve();
      });
    }).on('error', () => resolve());
  });
}

async function run() {
  await searchDaum('브이알코리아 박학문');
  await searchDaum('주식회사 브이알코리아 부산');
}

run();
