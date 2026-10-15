const https = require('https');

function testDDG(query) {
  return new Promise(resolve => {
    https.get('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 8000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(`[DDG] Status: ${res.statusCode}, Length: ${d.length}`);
        const m = d.match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
        console.log(`[DDG] Biz matches for "${query}":`, [...new Set(m)]);
        
        // Extract results
        const snippets = d.match(/<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/gi) || [];
        console.log(`[DDG] Snippets count: ${snippets.length}`);
        snippets.slice(0, 3).forEach(s => {
          console.log(' - ' + s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
        });
        resolve();
      });
    }).on('error', e => {
      console.log(`[DDG] Error: ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  await testDDG('디자인에코 부산');
  await testDDG('부산정보산업진흥원');
}

run();
