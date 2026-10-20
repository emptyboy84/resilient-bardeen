const https = require('https');

async function checkPhone() {
  const url = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent('010-9226-0114');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('Daum search len:', text.length);
  let idx = 0;
  while ((idx = text.indexOf('9226', idx)) !== -1) {
    console.log('Snippet:', text.slice(Math.max(0, idx - 40), idx + 100));
    idx += 10;
  }
}
checkPhone();
