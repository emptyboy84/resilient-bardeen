const https = require('https');

function searchBizno(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/?query=' + encodeURIComponent(query);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
}

async function run() {
  const query = '중앙대로226번길';
  console.log(`Searching Bizno for: ${query}`);
  const html = await searchBizno(query);
  
  // Extract all articles: href="/article/..."
  const regex = /<a\s+href="\/article\/(\d+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const bno = match[1];
    const title = match[2].replace(/<[^>]+>/g, '').trim();
    console.log(`[BNO: ${bno.slice(0,3)}-${bno.slice(3,5)}-${bno.slice(5)}] ${title}`);
  }
}

run();
