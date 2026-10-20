const https = require('https');

async function checkMois() {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent('이병상 051-923-0405');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const html = await res.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = text.indexOf('중앙행');
  if (idx !== -1) {
    console.log('Found 중앙행:', text.slice(Math.max(0, idx - 100), idx + 300));
  } else {
    console.log('중앙행 not found');
  }
}
checkMois();
