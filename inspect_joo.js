const https = require('https');

async function inspectHits() {
  const q = '452-88-03055';
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = 0;
  while ((idx = text.indexOf('주(JOO)', idx)) !== -1) {
    console.log('Snippet 주(JOO):', text.slice(Math.max(0, idx - 100), idx + 250));
    idx += 50;
  }
  
  // also check links in html around 452-88-03055
  let match;
  const linkRegex = /href="(https?:\/\/[^"]+)"/g;
  while ((match = linkRegex.exec(html)) !== null) {
    if (match[1].includes('biz') || match[1].includes('joo') || match[1].includes('452')) {
      console.log('Found link:', match[1]);
    }
  }
}
inspectHits();
