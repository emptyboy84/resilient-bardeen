const https = require('https');

https.get('https://book.mcst.go.kr/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const forms = data.match(/<form[\s\S]*?<\/form>/gi);
    console.log('Forms:', forms ? forms.length : 0);
    if (forms) console.log(forms[0]);
  });
});
