const https = require('https');

https.get('https://www.kobis.or.kr/kobis/web/comm/commjs/detailLayer.js', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const idx = d.indexOf("url = '/kobis/business/mast/comp/searchCompanyDtl.do'");
    console.log(d.slice(idx, idx + 1500));
  });
});
