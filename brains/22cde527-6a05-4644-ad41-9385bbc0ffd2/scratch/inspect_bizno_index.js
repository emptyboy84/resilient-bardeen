const https = require('https');

https.get('https://bizno.net', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // print first 1500 characters
    console.log(d.slice(0, 1500));
  });
});
