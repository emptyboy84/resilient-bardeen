const https = require('https');

https.get('https://book.mcst.go.kr/', (res) => {
  console.log('Status:', res.statusCode, res.headers.location);
});
