const https = require('https');

async function testW() {
  const queries = [
    '우리미디어 051-923',
    '우리미디어 팩스',
    '우리미디어 fax',
    '051-923-0404 팩스',
    '우리미디어 051-923-0405'
  ];
  for (const q of queries) {
    const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('=== ' + q + ' ===');
    let idx = text.indexOf('0405');
    if (idx !== -1) console.log('0405 hit:', text.slice(Math.max(0, idx - 40), idx + 80));
    let idx2 = text.indexOf('0404');
    if (idx2 !== -1) console.log('0404 hit:', text.slice(Math.max(0, idx2 - 40), idx2 + 80));
  }
}
testW();
