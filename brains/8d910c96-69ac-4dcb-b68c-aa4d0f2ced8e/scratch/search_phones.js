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
  const queries = ['010-2573-9696', '051-714-6488', '070-4866-6148', '051-518-7732'];
  for (const q of queries) {
    console.log('=== Query: ' + q + ' ===');
    const html = await searchBizno(q);
    const regex = /href="\/article\/([0-9]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      console.log(`[${match[1]}] ${match[2].replace(/<[^>]+>/g, '').trim()}`);
    }
  }
}

run();
