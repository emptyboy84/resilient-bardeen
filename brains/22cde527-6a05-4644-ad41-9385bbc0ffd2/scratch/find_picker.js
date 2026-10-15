const https = require('https');

function fetchBiznoSearch(q) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/?query=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const d = await fetchBiznoSearch('피커 스튜디오');
  const m = d.match(/<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>/gi) || [];
  m.forEach(x => {
    const b = x.match(/\/article\/(\d{10})/)[1];
    const title = x.replace(/<[^>]+>/g, '').trim();
    console.log('Bizno:', b, '| Title:', title);
  });
}
run();
