const https = require('https');

https.get('https://bizno.net/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const formMatch = d.match(/<form[\s\S]*?<\/form>/gi) || [];
    console.log('Forms found:', formMatch.length);
    for (let f of formMatch) {
      console.log('FORM:', f);
    }
  });
});
