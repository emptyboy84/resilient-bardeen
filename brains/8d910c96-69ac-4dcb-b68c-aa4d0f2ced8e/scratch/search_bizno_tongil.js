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
  const html = await searchBizno('작은통일');
  const regex = /href="\/article\/([0-9]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    console.log(`[${match[1]}] ${match[2].replace(/<[^>]+>/g, '').trim()}`);
  }
}

run();
