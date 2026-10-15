const https = require('https');

function searchBizno(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/?query=' + encodeURIComponent(query);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    req.on('error', reject);
  });
}

async function run() {
  const queries = ['동화사', '051-464-0761', '중앙대로226번길 7-6', '초량동 1196-3'];
  for (const q of queries) {
    console.log(`\n================ Searching: ${q} ================`);
    const res = await searchBizno(q);
    console.log('Status:', res.statusCode);
    
    // Parse results
    // bizno result list usually in <div class="titles"> or similar
    const body = res.body;
    // Check if there are matches
    const lines = body.split('\n');
    let matchedLines = [];
    lines.forEach(l => {
      if (l.includes('article') || l.includes('title') || l.includes('부산') || l.includes('동화') || l.includes('출판')) {
        const text = l.replace(/<[^>]+>/g, '').trim();
        if (text.length > 0 && text.length < 200) {
          matchedLines.push(text);
        }
      }
    });
    console.log('Sample matched lines:', matchedLines.slice(0, 15).join(' | '));

    // Also look for business registration numbers (pattern: ddd-dd-ddddd)
    const bnoMatches = body.match(/\b\d{3}-\d{2}-\d{5}\b/g);
    if (bnoMatches) {
      console.log('Business Numbers found:', [...new Set(bnoMatches)]);
    }
  }
}

run();
