const https = require('https');

https.get('https://www.saramin.co.kr/zf_user/company-info/view?csn=ZjQvcWk4cUVOYW9KWnh3b1AxWUNNZz09', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // search for year next to 매출액
    const idx = d.indexOf('매출액');
    if (idx !== -1) {
      console.log('Surrounding HTML around 매출액 (first):');
      console.log(d.substring(Math.max(0, idx - 200), idx + 200));
    }
  });
});
