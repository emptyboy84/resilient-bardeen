const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: d }));
    }).on('error', e => resolve({ status: 500, data: '' }));
  });
}

async function test() {
  // Test search endpoints
  const url1 = 'https://bizno.net/?query=' + encodeURIComponent('단디콤');
  const res1 = await fetchUrl(url1);
  console.log('Bizno /?query= status:', res1.status, 'len:', res1.data.length);
  const articles = res1.data.match(/\/article\/[0-9]+/g);
  console.log('Article links for 단디콤:', articles);

  const url2 = 'https://bizno.net/?query=' + encodeURIComponent('도서출판일광');
  const res2 = await fetchUrl(url2);
  console.log('Bizno /?query= status for 도서출판일광:', res2.status, 'len:', res2.data.length);
  const articles2 = res2.data.match(/\/article\/[0-9]+/g);
  console.log('Article links for 도서출판일광:', articles2);
}

test();
