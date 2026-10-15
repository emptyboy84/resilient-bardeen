const https = require('https');

https.get('https://bizno.net/article/6061643962', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const m = d.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    console.log('=== 피커스튜디오 (6061643962) ===');
    console.log('Meta:', m ? m[1] : 'NONE');
  });
});
