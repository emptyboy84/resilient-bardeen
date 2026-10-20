const https = require('https');

async function probe() {
  const bno = '4528803055';
  console.log('=== 1. Probing Bizno ===');
  try {
    const res = await fetch(`https://bizno.net/article/${bno}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    console.log('Bizno len:', text.length);
    const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Bizno phones:', [...new Set(phones || [])]);
    let idx = clean.indexOf('452-88-03055');
    if (idx !== -1) console.log('Bizno snippet:', clean.slice(Math.max(0, idx - 100), idx + 300));
  } catch (e) {
    console.log('Bizno err:', e.message);
  }

  console.log('\n=== 2. Probing FTC 통신판매업 ===');
  try {
    const url = 'https://www.ftc.go.kr/bizCommPop.do?wrkr_no=' + bno;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('FTC phones:', [...new Set(phones || [])]);
    if (clean.includes('정수연') || clean.includes('마린시티')) {
      console.log('FTC snippet:', clean.slice(0, 500));
    } else {
      console.log('FTC no direct match in pop, length:', text.length);
    }
  } catch (e) {
    console.log('FTC err:', e.message);
  }

  console.log('\n=== 3. Probing Saramin ===');
  try {
    const url = 'https://www.saramin.co.kr/zf_user/search/company?searchword=' + encodeURIComponent('4528803055');
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Saramin bno search phones:', [...new Set(phones || [])]);
    const links = text.match(/\/zf_user\/company-info\/view[^\s"'<>]+/g);
    console.log('Saramin links:', [...new Set(links || [])]);
  } catch (e) {
    console.log('Saramin err:', e.message);
  }
}
probe();
