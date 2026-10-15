const https = require('https');

https.get('https://www.saramin.co.kr/zf_user/company-info/view?csn=ZjQvcWk4cUVOYW9KWnh3b1AxWUNNZz09', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Language': 'ko-KR' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const matches = d.match(/href="[^"]*"/g) || [];
    const rel = matches.filter(m => m.includes('company') || m.includes('csn') || m.includes('financial') || m.includes('salary'));
    console.log('Filtered links:', [...new Set(rel)].slice(0, 20));
  });
});
