const https = require('https');

function searchDaum(q) {
  return new Promise(resolve => {
    https.get('https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q), {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const m = d.match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
        console.log(`[Daum] "${q}" biz matches:`, [...new Set(m)]);
        resolve();
      });
    }).on('error', () => resolve());
  });
}

async function run() {
  await searchDaum('soulfilm98@gmail.com');
  await searchDaum('051-731-5878');
  await searchDaum('051-731-5872');
}

run();
