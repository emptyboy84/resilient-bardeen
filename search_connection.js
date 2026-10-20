const https = require('https');

async function checkConnection() {
  const queries = [
    '051-923-0405',
    '923-0405',
    '유네이드 051',
    '이병상 051',
    '대저중앙로 46 051',
    '대저중앙로 46 202호',
    '유통단지1로 50 216동 205호'
  ];

  for (const q of queries) {
    const url = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('=== Daum: ' + q + ' ===');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones:', [...new Set(phones || [])]);
    let idx = text.indexOf('0405');
    if (idx !== -1) console.log('0405 snippet:', text.slice(Math.max(0, idx - 40), idx + 80));
    let idx2 = text.indexOf('유네이드');
    if (idx2 !== -1) console.log('유네이드 snippet:', text.slice(Math.max(0, idx2 - 40), idx2 + 80));
  }
}
checkConnection();
