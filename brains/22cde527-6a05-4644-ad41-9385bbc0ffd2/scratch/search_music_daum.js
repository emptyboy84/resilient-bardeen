const https = require('https');

function searchDaum(q) {
  return new Promise(resolve => {
    https.get('https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const text = d.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const m = d.match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
        console.log(`[Daum] "${q}" -> biz:`, [...new Set(m)]);
        // Look for place/local snippet
        const idx = text.indexOf('도로명') !== -1 ? text.indexOf('도로명') : text.indexOf(q.split(' ')[0]);
        if (idx !== -1) {
          console.log(`   Text:`, text.slice(idx, idx + 250));
        }
        resolve();
      });
    }).on('error', () => resolve());
  });
}

async function run() {
  await searchDaum('무몽크 부산');
  await searchDaum('거창레코드 부전동');
  await searchDaum('동화사 초량동');
}

run();
