const https = require('https');

function searchBizno(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/?header=search&query=' + encodeURIComponent(query);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', err => reject(err));
    });
  });
}

function getArticle(bno) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/article/' + bno;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', err => reject(err));
    });
  });
}

async function run() {
  const bnos = ['1353012037', '8099101438'];
  for (const b of bnos) {
    const html = await getArticle(b);
    console.log('=== Article ' + b + ' ===');
    const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    console.log('Title:', title);
    // extract table or text info
    const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const m = clean.match(/사업자등록번호[\s\S]{1,500}/);
    if (m) console.log(m[0].substring(0, 300));
  }
}

run();
