const https = require('https');

function testGoogle(query) {
  return new Promise(resolve => {
    https.get('https://www.google.com/search?q=' + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 8000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(`[Google] Status: ${res.statusCode}, Length: ${d.length}`);
        const m = d.match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
        console.log(`[Google] Biz matches for "${query}":`, [...new Set(m)]);
        const text = d.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        console.log(`[Google] Snippet: ${text.slice(0, 300)}`);
        resolve();
      });
    }).on('error', e => {
      console.log(`[Google] Error: ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  await testGoogle('"디자인에코" "이돈희"');
  await testGoogle('"동아대학교출판사" 사업자등록번호');
}

run();
