const fs = require('fs');

async function checkBizno() {
  const biz = '3728101636';
  const res = await fetch(`https://bizno.net/article/${biz}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  console.log('Bizno len:', html.length);
  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
  for (const r of rows) {
    const clean = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (clean.includes('전화') || clean.includes('팩스') || clean.includes('주소') || clean.includes('대표')) {
      console.log('Row:', clean);
    }
  }
}

checkBizno();
