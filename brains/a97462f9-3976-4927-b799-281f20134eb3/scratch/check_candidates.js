const https = require('https');

function getBiznoArticle(bno) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/article/' + bno;
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
  const bnos = ['4419101912', '6031284118', '6071757826'];
  for (const b of bnos) {
    console.log(`\n=== BNO: ${b} ===`);
    const html = await getBiznoArticle(b);
    const lines = html.split('\n');
    lines.forEach(l => {
      const t = l.replace(/<[^>]+>/g, '').trim();
      if (t.includes('회사명') || t.includes('대표자') || t.includes('주소') || t.includes('설립일') || t.includes('전화번호') || t.includes('상태') || t.includes('업종')) {
        console.log(' ', t);
      }
    });
  }
}

run();
