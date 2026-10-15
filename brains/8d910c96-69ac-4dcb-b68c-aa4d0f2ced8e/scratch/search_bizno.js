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

async function run() {
  const queries = ['최유창', '곽재홍', '이진수 만화', '이수연 만화', '이지현 만화'];
  for (const q of queries) {
    console.log('=== Query: ' + q + ' ===');
    const html = await searchBizno(q);
    const regex = /href="\/article\/([0-9]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null) {
      const bno = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      console.log(`[${bno}] ${text}`);
      count++;
    }
    if (count === 0) console.log('No direct matches found');
  }
}

run();
