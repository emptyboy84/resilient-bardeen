const https = require('https');

async function checkAddress() {
  const queries = [
    '유통단지1로 50 216동 205호',
    '부산티플렉스 216동 205호',
    '티플렉스 216동 205호',
    '대저중앙로 46 202호',
    '대저중앙로 46 2층'
  ];

  for (const q of queries) {
    const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('=== ' + q + ' ===');
    const phones = text.match(/(?:051|02|070|010)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones:', [...new Set(phones || [])]);
    let idx = text.indexOf('0405');
    if (idx !== -1) console.log('0405:', text.slice(Math.max(0, idx - 40), idx + 60));
  }
}
checkAddress();
