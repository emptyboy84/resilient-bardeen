const https = require('https');

async function probeMcube() {
  console.log('=== 1. Checking 051-582-7534 on Naver ===');
  const res1 = await fetch('https://search.naver.com/search.naver?query=' + encodeURIComponent('051-582-7534'), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text1 = (await res1.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = 0;
  while ((idx = text1.indexOf('051-582-7534', idx)) !== -1) {
    console.log('Snippet 582-7534:', text1.slice(Math.max(0, idx - 80), idx + 150));
    idx += 20;
  }

  console.log('\n=== 2. Checking 801-88-01341 on Bizno ===');
  const res2 = await fetch('https://bizno.net/article/8018801341', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text2 = (await res2.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx2 = text2.indexOf('801-88-01341');
  if (idx2 !== -1) {
    console.log('Bizno snippet:', text2.slice(Math.max(0, idx2 - 100), idx2 + 400));
  }

  console.log('\n=== 3. Checking (주)엠큐브 김경희 ===');
  const res3 = await fetch('https://search.naver.com/search.naver?query=' + encodeURIComponent('"엠큐브" "김경희"'), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text3 = (await res3.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx3 = text3.indexOf('김경희');
  while (idx3 !== -1) {
    console.log('Snippet 김경희:', text3.slice(Math.max(0, idx3 - 50), idx3 + 120));
    idx3 = text3.indexOf('김경희', idx3 + 1);
  }

  console.log('\n=== 4. Checking 대저로235번길 35-1 ===');
  const res4 = await fetch('https://search.naver.com/search.naver?query=' + encodeURIComponent('"대저로235번길 35-1"'), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text4 = (await res4.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const phones4 = text4.match(/(?:051|02|070|010)-[0-9]{3,4}-[0-9]{4}/g);
  console.log('Phones at address:', [...new Set(phones4 || [])]);
  let idx4 = text4.indexOf('35-1');
  if (idx4 !== -1) console.log('Address snippet:', text4.slice(Math.max(0, idx4 - 50), idx4 + 150));
}

probeMcube();
