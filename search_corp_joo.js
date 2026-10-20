const https = require('https');

async function searchAll() {
  const queries = [
    '452-88-03055',
    '4528803055',
    '180111-1523299',
    '"한일오르듀" 216호',
    '"마린시티3로 37" 216호',
    '"주식회사 주" 정수연',
    '"(주)주" 정수연'
  ];

  for (const q of queries) {
    console.log(`\n=================== Query: ${q} ===================`);
    // Naver
    try {
      const nUrl = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
      const res = await fetch(nUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
      const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
      console.log('Naver phones:', [...new Set(phones || [])]);
      let idx = 0;
      let count = 0;
      const terms = ['452', '1523299', '216호', '정수연'];
      for (const t of terms) {
        let p = text.indexOf(t);
        if (p !== -1) {
          console.log(`  [Naver hit ${t}]:`, text.slice(Math.max(0, p - 60), p + 120));
        }
      }
    } catch(e) {
      console.log('Naver err:', e.message);
    }

    // Daum
    try {
      const dUrl = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q);
      const res = await fetch(dUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
      console.log('Daum phones:', [...new Set(phones || [])]);
      const terms = ['452', '1523299', '216호', '정수연'];
      for (const t of terms) {
        let p = text.indexOf(t);
        if (p !== -1) {
          console.log(`  [Daum hit ${t}]:`, text.slice(Math.max(0, p - 60), p + 120));
        }
      }
    } catch(e) {
      console.log('Daum err:', e.message);
    }
  }
}
searchAll();
