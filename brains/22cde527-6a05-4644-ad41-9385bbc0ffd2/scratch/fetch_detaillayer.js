const https = require('https');

https.get('https://www.kobis.or.kr/kobis/web/comm/commjs/detailLayer.js', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const fn = d.match(/function\s+mstView[\s\S]*?\{[\s\S]*?\}/i);
    console.log('detailLayer.js mstView:', fn ? fn[0].slice(0, 500) : 'not found');
  });
});
