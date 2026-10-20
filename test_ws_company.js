const fs = require('fs');

async function checkWsCompany() {
  const biz = '4878800369';
  const corp = '1801111040673';

  console.log('--- Probing Bizno ---');
  try {
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
  } catch(e) {
    console.log('Bizno err:', e.message);
  }

  console.log('\n--- Probing Saramin ---');
  try {
    const res = await fetch(`https://www.saramin.co.kr/zf_user/company-info/view?csn=${biz}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    console.log('Saramin len:', html.length);
    const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (jsonLd) console.log('JSON-LD:', jsonLd[1]);
    const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9*]{4}/g);
    console.log('Saramin phones:', [...new Set(phones || [])]);
  } catch(e) {
    console.log('Saramin err:', e.message);
  }
}

checkWsCompany();
