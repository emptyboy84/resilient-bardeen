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
  const queries = ['희 웹툰', '부산 웹툰', '부산만화', '스튜디오희'];
  for (const q of queries) {
    console.log(`\n=== Query: ${q} ===`);
    const html = await searchBizno(q);
    const regex = /<a\s+href="\/article\/(\d+)"[^>]*>([\s\S]*?)<\/a>/g;
    let match, count = 0;
    while ((match = regex.exec(html)) !== null) {
      count++;
      const bno = match[1];
      const title = match[2].replace(/<[^>]+>/g, '').trim();
      if (title.includes('웹툰') || title.includes('만화') || title.includes('스튜디오') || title.includes('희')) {
        console.log(`  [${bno.slice(0,3)}-${bno.slice(3,5)}-${bno.slice(5)}] ${title}`);
      }
    }
  }
}

run();
