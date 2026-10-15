const https = require('https');

https.get('https://book.mcst.go.kr', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // find forms
    const forms = d.match(/<form[\s\S]*?<\/form>/gi) || [];
    console.log('Forms count:', forms.length);
    forms.forEach((f, i) => {
      console.log(`Form ${i}:`, f.slice(0, 300));
    });
  });
});
