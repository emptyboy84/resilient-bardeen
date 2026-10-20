const https = require('https');

async function searchDeep() {
  const queries = [
    '유네이드 051-923-0405',
    '유네이드홀딩스 051-923-0405',
    '유네이드 923-0405',
    '이병상 051-923-0405',
    '이병상 923-0405',
    '유네이드',
    '유네이드홀딩스',
    '주식회사 유네이드',
    '051-923-0405',
    '0519230405'
  ];

  for (const q of queries) {
    const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (text.includes('923-0405') || text.includes('9230405')) {
      console.log('HIT for [' + q + ']');
      let idx = 0;
      while ((idx = text.indexOf('923-0405', idx)) !== -1) {
        console.log('  ', text.slice(Math.max(0, idx - 80), idx + 120));
        idx += 20;
      }
    } else {
      console.log('No hit for [' + q + ']');
    }
  }
}
searchDeep();
