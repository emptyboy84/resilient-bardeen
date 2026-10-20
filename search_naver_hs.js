const https = require('https');

async function searchNaver(q) {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('=== Naver Query: ' + q + ' (len: ' + text.length + ') ===');
  const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
  console.log('Phones in Naver:', [...new Set(phones || [])]);
  
  // snippet containing query or keywords
  ['7719', '에이치에스', '스카이비즈', '렌텍', '박현석'].forEach(kw => {
    let idx = 0;
    while ((idx = text.indexOf(kw, idx)) !== -1) {
      console.log(`[${kw}]: ` + text.slice(Math.max(0, idx - 40), idx + 80));
      idx += kw.length + 30;
    }
  });
}

async function run() {
  await searchNaver('0507-1357-7719');
  await searchNaver('에이치에스렌텍');
  await searchNaver('센텀스카이비즈 에이치에스렌텍');
  await searchNaver('센텀스카이비즈 2908');
}

run();
