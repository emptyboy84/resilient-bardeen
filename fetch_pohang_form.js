const https = require('https');
const fs = require('fs');

https.get('https://contract.pohang.go.kr/contract/contract_info/private_contract/service?page=84', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    fs.writeFileSync('pohang_page84.html', d);
    console.log('Saved page 84 len:', d.length);
    // search form
    const forms = d.match(/<form[\s\S]*?<\/form>/gi) || [];
    forms.forEach((f, i) => {
      console.log('Form ' + i + ':\n' + f);
    });
  });
});
