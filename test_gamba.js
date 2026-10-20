const https = require('https');

async function testGamba() {
  const q = '감바랩스';
  console.log('=== Naver for 감바랩스 ===');
  const res1 = await fetch('https://search.naver.com/search.naver?query=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text1 = (await res1.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const p1 = text1.match(/(?:051|02|070|010|0507|15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
  console.log('Naver phones:', [...new Set(p1 || [])]);
  let idx = 0;
  while ((idx = text1.indexOf('감바랩스', idx)) !== -1) {
    console.log(text1.slice(Math.max(0, idx - 30), idx + 100));
    idx += 50;
  }

  console.log('\n=== Daum for 감바랩스 ===');
  const res2 = await fetch('https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text2 = (await res2.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const p2 = text2.match(/(?:051|02|070|010|0507|15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
  console.log('Daum phones:', [...new Set(p2 || [])]);

  console.log('\n=== Saramin for 감바랩스 ===');
  const res3 = await fetch('https://www.saramin.co.kr/zf_user/search/company?searchword=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text3 = (await res3.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const p3 = text3.match(/(?:051|02|070|010|0507|15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
  console.log('Saramin phones:', [...new Set(p3 || [])].filter(p => !p.includes('6226-5000')));
}

testGamba();
