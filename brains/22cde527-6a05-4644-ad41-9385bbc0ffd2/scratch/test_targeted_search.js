const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function test() {
  const targets = [
    { name: '동아대학교출판부', query: '동아대학교출판부' },
    { name: '나래바람', query: '나래바람' },
    { name: '도서출판일광', query: '도서출판일광' },
    { name: '동화사', query: '동화사' },
    { name: '한국산업정보사', query: '한국산업정보사' }
  ];
  
  for (const t of targets) {
    const html = await fetchUrl('https://bizno.net/?query=' + encodeURIComponent(t.query));
    const m = html.match(/<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>/gi) || [];
    console.log(`=== ${t.name} (query: ${t.query}) ===`);
    m.slice(0, 3).forEach(x => {
      const b = x.match(/\/article\/(\d{10})/)[1];
      const title = x.replace(/<[^>]+>/g, '').trim();
      console.log(`  Bizno: ${b} | Title: ${title}`);
    });
  }
}
test();
