const https = require('https');
const fs = require('fs');

async function testNaverQuery(q) {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('naver_res.html', html, 'utf8');
  console.log('Query:', q, 'Status:', res.status, 'Len:', html.length);
  
  // check if place or smartcall exists
  const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = clean.indexOf('0507');
  while (idx !== -1) {
    console.log('Snippet 0507:', clean.slice(Math.max(0, idx - 60), idx + 100));
    idx = clean.indexOf('0507', idx + 10);
  }
}

testNaverQuery('0507-1357-7719');
