const https = require('https');

https.get('https://www.kobis.or.kr/kobis/business/mast/comp/searchCompanyList.do', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const scripts = d.match(/<script[^>]+src="([^"]+)"/gi) || [];
    scripts.forEach(s => console.log(s));
  });
});
