const https = require('https');

https.get('https://bizno.net/article/2878600784', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const m = d.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    console.log('=== 스튜디오제이주식회사 (2878600784) ===');
    console.log('Meta:', m ? m[1] : 'NONE');
  });
});
