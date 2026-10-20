const https = require('https');

async function searchNaver(q) {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('=== Naver: ' + q + ' (len: ' + text.length + ') ===');
  const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
  console.log('Phones:', [...new Set(phones || [])]);
  let idx = text.indexOf('923');
  while (idx !== -1) {
    console.log('923 snippet:', text.slice(Math.max(0, idx - 40), idx + 80));
    idx = text.indexOf('923', idx + 20);
  }
}

async function run() {
  await searchNaver('대저중앙로 46');
  await searchNaver('대저중앙로 46 202호');
  await searchNaver('유네이드홀딩스 전화');
}
run();
