const https = require('https');

function testUrl(name, url, headers = {}) {
  return new Promise(resolve => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        ...headers
      },
      timeout: 8000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const text = d.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        console.log(`[${name}] Status: ${res.statusCode}, Length: ${d.length}`);
        console.log(`   Snippet: ${text.slice(0, 200)}`);
        resolve();
      });
    }).on('error', e => {
      console.log(`[${name}] Error: ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  await testUrl('Daum', 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent('부산정보산업진흥원 사업자등록번호'));
  await testUrl('Bing', 'https://www.bing.com/search?q=' + encodeURIComponent('부산정보산업진흥원 사업자등록번호'));
  await testUrl('DuckDuckGo', 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent('부산정보산업진흥원 사업자등록번호'));
}

run();
