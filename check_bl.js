const https = require('https');

async function checkBL() {
  const q = '해운대 비엘공인중개사사무소';
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = 0;
  while ((idx = text.indexOf('우동', idx)) !== -1) {
    console.log(text.slice(Math.max(0, idx - 40), idx + 120));
    idx += 50;
  }
}
checkBL();
