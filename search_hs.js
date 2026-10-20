const https = require('https');
const fs = require('fs');

async function searchWeb() {
  const queries = [
    '0507-1357-7719',
    '050713577719',
    '에이치에스렌텍',
    'HS렌텍',
    '센텀스카이비즈 2908호',
    '센텀스카이비즈 A-2908호'
  ];

  for (const q of queries) {
    const url = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('=== Query: ' + q + ' ===');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones in Daum:', [...new Set(phones || [])]);
    
    ['7719', '에이치에스', '박현석', '2908'].forEach(kw => {
      let idx = 0;
      while ((idx = text.indexOf(kw, idx)) !== -1) {
        console.log(`[${kw}]: ` + text.slice(Math.max(0, idx - 40), idx + 80));
        idx += kw.length + 20;
      }
    });
  }
}

searchWeb();
