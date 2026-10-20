const https = require('https');

async function checkBizno() {
  const url = 'https://bizno.net/article/1478702439';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  console.log('Bizno length:', html.length);
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = text.indexOf('147-87-02439');
  if (idx !== -1) {
    console.log(text.slice(Math.max(0, idx - 100), idx + 400));
  }
}
checkBizno();
