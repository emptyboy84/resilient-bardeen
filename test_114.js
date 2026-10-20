const fs = require('fs');

async function test114() {
  const res = await fetch('https://www.114.co.kr/search?keyword=' + encodeURIComponent('부산 신카'), {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  });
  const html = await res.text();
  fs.writeFileSync('114_response.html', html, 'utf8');
  console.log('Saved 114_response.html, length:', html.length);
  const phones = html.match(/(?:051|02|070|010|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
  console.log('114 phones found:', [...new Set(phones || [])]);
  const telLinks = html.match(/href=["']tel:([^"']+)["']/g);
  console.log('Tel links:', telLinks);
}

test114();
