const https = require('https');

const url = 'https://book.mcst.go.kr/html/searchView.php?regn=251002015000001&ac1=6260000&ac2=3360000&area_code=&area_code2=3360000&page_type=area&cpage=6';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const clean = data.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log(clean);
  });
}).on('error', err => console.error(err));
