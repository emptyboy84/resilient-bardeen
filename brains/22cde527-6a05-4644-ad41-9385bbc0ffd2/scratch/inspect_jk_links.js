const https = require('https');

https.get('https://www.jobkorea.co.kr/Search/?stext=' + encodeURIComponent('브이드림') + '&tabType=corp', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Look for corp items
    const matches = d.match(/href="[^"]*(?:Company|Corp|company)[^"]*"/gi) || [];
    console.log('Matches:', [...new Set(matches)].slice(0, 10));
  });
});
