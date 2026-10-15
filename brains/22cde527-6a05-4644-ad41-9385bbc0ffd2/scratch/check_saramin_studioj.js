const https = require('https');

https.get('https://www.saramin.co.kr/zf_user/company-info/view?csn=L0p3bkJKaTlZWUxHMkQwRE1id2YyUT09', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // search for business number or corp number
    const m = d.match(/\d{3}-\d{2}-\d{5}/g) || [];
    console.log('Biz numbers found on saramin:', m);
    // search for address and ceo
    const mCeo = d.match(/대표자명[\s\S]{0,100}/i);
    console.log('Ceo snippet:', mCeo ? mCeo[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'NONE');
    const mAddr = d.match(/주소[\s\S]{0,100}/i);
    console.log('Addr snippet:', mAddr ? mAddr[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'NONE');
  });
});
