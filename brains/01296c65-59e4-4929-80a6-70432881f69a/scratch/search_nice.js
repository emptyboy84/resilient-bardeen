const https = require('https');

function searchNice(query) {
  return new Promise((resolve, reject) => {
    const url = `https://www.nicebizinfo.com/ep/EP0100M001GE.nice?searchWord=${encodeURIComponent(query)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const queries = ['스튜디오비오', '스튜디오 비오', '이한빈'];
  for (const q of queries) {
    console.log(`=== NiceBizInfo: ${q} ===`);
    const html = await searchNice(q);
    console.log('Length:', html.length);
    // find company names, biznos, ceo
    const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const pos = clean.indexOf('검색결과');
    if (pos !== -1) {
      console.log(clean.substring(pos, pos + 500));
    } else {
      console.log(clean.substring(0, 500));
    }
  }
}

main();
