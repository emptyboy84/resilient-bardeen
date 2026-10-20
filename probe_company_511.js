const https = require('https');

async function probe511() {
  const bno = '1803001087';
  console.log('=== 1. Bizno for 글로그림 ===');
  try {
    const res = await fetch(`https://bizno.net/article/${bno}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    console.log('Bizno len:', text.length);
    const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
    console.log('Bizno phones:', [...new Set(phones || [])]);
    let idx = clean.indexOf('180-30-01087');
    if (idx !== -1) console.log('Bizno snippet:', clean.slice(Math.max(0, idx - 80), idx + 250));
  } catch (e) {
    console.log('Bizno err:', e.message);
  }

  console.log('\n=== 2. Naver for 글로그림 ===');
  try {
    const q = '글로그림';
    const res = await fetch('https://search.naver.com/search.naver?query=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
    console.log('Naver phones:', [...new Set(phones || [])]);
    let idx = text.indexOf('글로그림');
    while (idx !== -1) {
      console.log('Naver snippet:', text.slice(Math.max(0, idx - 40), idx + 120));
      idx = text.indexOf('글로그림', idx + 1);
    }
  } catch (e) {
    console.log('Naver err:', e.message);
  }

  console.log('\n=== 3. Daum for 글로그림 ===');
  try {
    const q = '글로그림';
    const res = await fetch('https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
    console.log('Daum phones:', [...new Set(phones || [])]);
    let idx = text.indexOf('글로그림');
    while (idx !== -1) {
      console.log('Daum snippet:', text.slice(Math.max(0, idx - 40), idx + 120));
      idx = text.indexOf('글로그림', idx + 1);
    }
  } catch (e) {
    console.log('Daum err:', e.message);
  }
}

probe511();
