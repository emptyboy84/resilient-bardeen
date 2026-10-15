const https = require('https');

https.get('https://bizno.net/article/1868600972', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const rows = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    for (let r of rows) {
      const clean = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean && !clean.includes('adsbygoogle') && !clean.includes('정정문의')) {
        console.log('ROW:', clean);
      }
    }
  });
});
