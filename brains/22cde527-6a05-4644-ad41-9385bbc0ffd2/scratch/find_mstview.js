const https = require('https');

https.get('https://www.kobis.or.kr/kobis/business/mast/comp/searchCompanyList.do', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const fn = d.match(/function\s+mstView[\s\S]*?\{[\s\S]*?\}/i);
    console.log('mstView function:', fn ? fn[0] : 'not found in page body');
  });
});
