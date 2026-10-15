const https = require('https');

function searchBizno(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/?query=' + encodeURIComponent(query);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const q = '웹툰';
  const html = await searchBizno(q);
  const regex = /<a\s+href="\/article\/(\d+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match, count = 0;
  while ((match = regex.exec(html)) !== null) {
    count++;
    const bno = match[1];
    const title = match[2].replace(/<[^>]+>/g, '').trim();
    console.log(`[${bno}] ${title}`);
  }
}

run();
