const fs = require('fs');

async function searchSkybiz() {
  const queries = [
    '센텀스카이비즈 C105',
    '센텀스카이비즈 씨105',
    '대경산업개발 손정희',
    '대경산업개발 대표'
  ];
  for (const q of queries) {
    const url = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('=== Query: ' + q + ' ===');
    const phones = text.match(/(?:051|02|070|031|01[016789])-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones:', [...new Set(phones || [])]);
    
    // print snippets containing target words
    ['C105', '씨105', '손정희', '대경산업개발'].forEach(word => {
      let idx = 0;
      while ((idx = text.indexOf(word, idx)) !== -1) {
        console.log(`[${word}]: ` + text.slice(Math.max(0, idx - 40), idx + 80));
        idx += word.length + 10;
      }
    });
  }
}
searchSkybiz();
