const https = require('https');

async function checkYt() {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent('"글로그림"');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  let idx = 0;
  while ((idx = html.indexOf('youtube.com', idx)) !== -1) {
    console.log(html.slice(Math.max(0, idx - 50), idx + 200));
    idx = html.indexOf('youtube.com', idx + 1);
  }
}
checkYt();
