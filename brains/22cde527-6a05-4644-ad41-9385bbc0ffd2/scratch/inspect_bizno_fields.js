const https = require('https');

https.get('https://bizno.net/article/6031085753', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Extract table rows or key-value pairs
    const rows = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    console.log('Total table rows:', rows.length);
    for (let r of rows) {
      const clean = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean) console.log('ROW:', clean);
    }
    // Also look for keywords
    const keywords = ['매출', '재무', '자본', '영업이익', '결산', '금액'];
    for (let k of keywords) {
      if (d.includes(k)) {
        console.log(`Keyword "${k}" is present in page!`);
      }
    }
  });
});
