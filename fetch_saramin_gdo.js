const https = require('https');
const fs = require('fs');

const url = 'https://www.saramin.co.kr/zf_user/company-info/view/csn/cmE4ZDRNdTFpRVh1eEZBWFhyM1pqUT09/company_nm/%EC%A7%80%EB%94%94%EC%98%A4(%EC%A3%BC)';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
  }
}, res => {
  console.log('Status:', res.statusCode);
  if (res.statusCode >= 300 && res.statusCode < 400) {
    console.log('Redirect to:', res.headers.location);
  }
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    fs.writeFileSync('saramin_gdo.html', d);
    console.log('Saved saramin_gdo.html, length:', d.length);
  });
}).on('error', e => console.error(e));
