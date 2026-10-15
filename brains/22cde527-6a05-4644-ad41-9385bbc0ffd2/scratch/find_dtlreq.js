const https = require('https');

https.get('https://www.kobis.or.kr/kobis/web/comm/commjs/detailLayer.js', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const fn = d.match(/function\s+dtlReq[\s\S]*?\{[\s\S]*?\n\}/i);
    console.log('dtlReq function:', fn ? fn[0].slice(0, 1000) : 'not found');
  });
});
