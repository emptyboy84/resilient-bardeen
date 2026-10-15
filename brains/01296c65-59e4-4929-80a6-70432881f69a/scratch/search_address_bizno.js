const https = require('https');

function searchBizno(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/?query=' + encodeURIComponent(query);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    https.get(url, options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const queries = ['수영강변대로 140', '수영강변대로140', '문화콘텐츠 3층', '부산문화콘텐츠콤플렉스'];
  for (const q of queries) {
    console.log(`=== Query: ${q} ===`);
    const html = await searchBizno(q);
    const regex = /<a[^>]*href="\/article\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null) {
      const text = match[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
      console.log(`- [${match[1]}] ${text}`);
      count++;
    }
    console.log(`Total: ${count}`);
  }
}

main();
