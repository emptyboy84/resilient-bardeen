const https = require('https');

const url = 'https://book.mcst.go.kr/html/searchView.php?regn=251002015000001&ac1=6260000&ac2=3360000&area_code=&area_code2=3360000&page_type=area&cpage=6';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // print table html
    const m = data.match(/<table[\s\S]*?<\/table>/gi);
    if (m) {
      m.forEach(t => console.log(t));
    }
  });
}).on('error', err => console.error(err));
