const https = require('https');

async function checkKaiser() {
  const queries = [
    '마린시티3로 39 709호',
    '카이저빌 709호',
    '"마린시티3로 39" 709',
    '"카이저빌" 709',
    '주식회사 주 카이저빌',
    '카이저빌 주식회사 주'
  ];

  for (const q of queries) {
    console.log('=== ' + q + ' ===');
    const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones:', [...new Set(phones || [])]);
    let idx = text.indexOf('709호');
    if (idx !== -1) console.log('709호 snippet:', text.slice(Math.max(0, idx - 40), idx + 80));
    let idx2 = text.indexOf('정수연');
    if (idx2 !== -1) console.log('정수연 snippet:', text.slice(Math.max(0, idx2 - 40), idx2 + 80));
  }
}
checkKaiser();
