const https = require('https');

https.get('https://bizno.net/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const idx = d.indexOf('goSearch');
    if (idx !== -1) {
      console.log(d.substring(idx - 50, idx + 400));
    }
  });
});
