const https = require('https');
const fs = require('fs');

function searchBizno(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/?query=' + encodeURIComponent(query);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
  const queries = ['스튜디오비오', '스튜디오 비오', '이한빈', '010-5093-0304'];
  for (const q of queries) {
    console.log(`=== Query: ${q} ===`);
    try {
      const html = await searchBizno(q);
      const regex = /<a[^>]*href="\/article\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      let count = 0;
      while ((match = regex.exec(html)) !== null) {
        const text = match[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
        console.log(`- [${match[1]}] ${text}`);
        count++;
      }
      if (count === 0) {
        console.log('No articles found.');
      }
    } catch (e) {
      console.error(e);
    }
  }
}

main();
