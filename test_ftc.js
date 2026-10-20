const fs = require('fs');

async function checkFtc() {
  const bizNo = '7718100829';
  console.log('--- Probing FTC for bizNo 771-81-00829 ---');
  try {
    const url = `https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${bizNo}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('FTC status:', res.status);
    const html = await res.text();
    console.log('FTC len:', html.length);
    const thMatches = html.match(/<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    for (const m of thMatches) {
      const clean = m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean.includes('전화') || clean.includes('상호') || clean.includes('대표') || clean.includes('주소') || clean.includes('신고')) {
        console.log('  ->', clean);
      }
    }
    const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
    console.log('Phones in FTC:', phones);
  } catch(e) {
    console.log('FTC err:', e.message);
  }
}

checkFtc();
