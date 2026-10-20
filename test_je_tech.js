const fs = require('fs');

async function checkJeTech() {
  const biz = '3438602608';
  const kis = 'PQ5306';

  console.log('--- Probing NiceBizInfo KIS PQ5306 ---');
  try {
    const url = `https://m.nicebizinfo.com/ep/EP0100M002GE.nice?kiscode=${kis}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' }
    });
    const html = await res.text();
    console.log('Nice status:', res.status, 'len:', html.length);
    const rows = html.match(/<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    for (const r of rows) {
      const clean = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean.includes('전화') || clean.includes('팩스') || clean.includes('주소') || clean.includes('대표') || clean.includes('업종')) {
        console.log('Nice Row:', clean);
      }
    }
    const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
    console.log('Nice all phones:', [...new Set(phones || [])]);
  } catch(e) {
    console.log('Nice err:', e.message);
  }

  console.log('\n--- Probing Bizno ---');
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
        console.log('Bizno Row:', clean);
      }
    }
  } catch(e) {
    console.log('Bizno err:', e.message);
  }
}

checkJeTech();
