const https = require('https');

async function searchWeb(query) {
  // Use duckduckgo html or google
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  return new Promise((resolve, reject) => {
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
  const queries = [
    'site:bipa.or.kr "인디랩"',
    'site:busangame.or.kr "스튜디오비오"',
    'site:busangame.or.kr "이한빈"',
    '"스튜디오비오" site:bipa.or.kr',
    '"이한빈" "스튜디오비오"',
    '"Studio Bio" "이한빈"',
    '"Studio Bio" game busan'
  ];

  for (const q of queries) {
    console.log(`\n=== DDG: ${q} ===`);
    const html = await searchWeb(q);
    const regex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null) {
      console.log('Snippet:', match[1].replace(/<[^>]+>/g, '').trim());
      count++;
    }
    if (count === 0) console.log('No results');
  }
}

main();
