const https = require('https');

function testBizno(query, area = '') {
  return new Promise((resolve) => {
    const url = `https://bizno.net/?area=${encodeURIComponent(area)}&query=${encodeURIComponent(query)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        // extract table or titles
        const titles = d.match(/<h5[^>]*>[\s\S]*?<\/h5>/gi) || [];
        const links = d.match(/\/article\/[0-9]+/g) || [];
        resolve({ status: res.statusCode, len: d.length, titles: titles.map(t => t.replace(/<[^>]+>/g, '').trim()), links: [...new Set(links)] });
      });
    });
  });
}

async function run() {
  console.log('Test "디자인에코":', await testBizno('디자인에코'));
  console.log('Test "피커스튜디오":', await testBizno('피커스튜디오'));
}

run();
