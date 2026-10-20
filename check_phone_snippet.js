const https = require('https');

async function checkPhone() {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent('주식회사 주 카이저빌');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = text.indexOf('051-715-7317');
  if (idx !== -1) {
    console.log(text.slice(Math.max(0, idx - 150), idx + 250));
  } else {
    console.log('Not found');
  }
}
checkPhone();
