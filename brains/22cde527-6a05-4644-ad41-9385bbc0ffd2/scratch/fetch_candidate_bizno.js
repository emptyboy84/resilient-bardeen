const https = require('https');

function fetchArticle(art) {
  return new Promise((resolve) => {
    https.get(`https://bizno.net${art}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const rows = (d.match(/<tr[\s\S]*?<\/tr>/gi) || []).map(r => r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
        resolve(rows.filter(r => !r.includes('adsbygoogle') && !r.includes('정정문의')));
      });
    });
  });
}

async function run() {
  console.log('=== 메타블루 ===');
  console.log(await fetchArticle('/article/6608502146'));

  console.log('\n=== 에코비티 ===');
  console.log(await fetchArticle('/article/4768103445'));
}

run();
