const https = require('https');

async function search() {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent('주식회사 유솔라');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = 0;
  while ((idx = text.indexOf('유솔라', idx)) !== -1) {
    console.log('Snippet:', text.slice(Math.max(0, idx - 60), idx + 150));
    idx += 50;
  }
}
search();
