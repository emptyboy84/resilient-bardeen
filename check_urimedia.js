const https = require('https');

async function check() {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent('우리미디어 부산');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const matches = html.match(/https?:\/\/[^\s"']+/g) || [];
  const domains = matches.filter(u => u.includes('urimedia') || u.includes('woorimedia'));
  console.log('Domains:', [...new Set(domains)]);
  
  // also check text
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = 0;
  while ((idx = text.indexOf('우리미디어', idx)) !== -1) {
    console.log(text.slice(Math.max(0, idx - 20), idx + 100));
    idx += 50;
  }
}
check();
