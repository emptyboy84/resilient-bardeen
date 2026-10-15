const https = require('https');

https.get('https://www.catch.co.kr/Search/SearchList?SearchKeyword=' + encodeURIComponent('브이드림'), {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Catch search len:', d.length);
    const links = d.match(/href="[^"]*CompSummary[^"]*"/gi) || [];
    console.log('Catch CompSummary links:', links);
  });
});
