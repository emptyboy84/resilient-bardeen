const https = require('https');

async function getPlaceId() {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent('해운대 비엘공인중개사사무소');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const match = html.match(/place\.naver\.com\/[a-z]+\/([0-9]+)/);
  console.log('Place URL match:', match ? match[0] : 'None');
  let idx = html.indexOf('051-782-0415');
  if (idx !== -1) {
    console.log(html.slice(idx - 200, idx + 300));
  }
}
getPlaceId();
