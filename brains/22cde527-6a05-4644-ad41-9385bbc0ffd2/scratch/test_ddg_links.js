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
        // Find links
        const linkMatches = d.match(/<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];
        console.log('Snippet tags found:', linkMatches.length);
        // Find result titles
        const titles = d.match(/<a[^>]+class="[^"]*result__url[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];
        console.log('URL tags found:', titles.length);

        const anyResult = d.match(/<div class="result\s[\s\S]*?<\/div>\s*<\/div>/gi) || [];
        console.log('Div results found:', anyResult.length);
        if (anyResult.length > 0) {
          console.log('Sample result:', anyResult[0].slice(0, 500));
        }
        resolve();
      });
    }).on('error', () => resolve());
  });
}

testDDG('디자인에코 부산');
