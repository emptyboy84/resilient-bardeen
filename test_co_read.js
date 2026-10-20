const fs = require('fs');

async function checkCoRead() {
  const url = 'https://www.jobkorea.co.kr/Recruit/Co_Read/C/22554851';
  console.log('Fetching:', url);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Len:', html.length);
  fs.writeFileSync('ws_co_read.html', html, 'utf8');

  const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
  console.log('Phones in Co_Read:', [...new Set(phones || [])]);

  // find table items
  const items = html.match(/<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
  items.forEach(it => {
    const clean = it.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (clean.includes('전화') || clean.includes('팩스') || clean.includes('홈페이지') || clean.includes('주소') || clean.includes('대표')) {
      console.log('Item:', clean);
    }
  });

  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLd) console.log('JSON-LD:', jsonLd[1]);
}

checkCoRead();
