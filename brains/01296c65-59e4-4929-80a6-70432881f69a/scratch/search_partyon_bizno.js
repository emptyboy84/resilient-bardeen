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
  const queries = ['파티온', '양운로 56', '양운로56', 'SK허브올리브', '051-7659-2772', '7659-2772'];
  for (const q of queries) {
    console.log(`=== Query: ${q} ===`);
    const html = await searchBizno(q);
    const regex = /<a[^>]*href="\/article\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null) {
      const text = match[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
      if (!text.includes('정육마트') && !text.includes('지게차') && !text.includes('신한텍스타일')) {
        console.log(`- [${match[1]}] ${text}`);
        count++;
      }
    }
    console.log(`Found: ${count}`);
  }
}

main();
