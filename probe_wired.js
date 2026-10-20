const https = require('https');

async function probeWired() {
  console.log('=== 1. Checking 051-678-3154 on Naver ===');
  const res1 = await fetch('https://search.naver.com/search.naver?query=' + encodeURIComponent('051-678-3154'), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text1 = (await res1.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx = 0;
  while ((idx = text1.indexOf('051-678-3154', idx)) !== -1) {
    console.log('Snippet 678-3154:', text1.slice(Math.max(0, idx - 80), idx + 150));
    idx += 20;
  }

  console.log('\n=== 2. Checking 051-678-3154 on Daum ===');
  const res1d = await fetch('https://search.daum.net/search?w=tot&q=' + encodeURIComponent('051-678-3154'), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text1d = (await res1d.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idxd = 0;
  while ((idxd = text1d.indexOf('051-678-3154', idxd)) !== -1) {
    console.log('Daum Snippet 678-3154:', text1d.slice(Math.max(0, idxd - 80), idxd + 150));
    idxd += 20;
  }

  console.log('\n=== 3. Checking Bizno for 736-81-01621 ===');
  const res2 = await fetch('https://bizno.net/article/7368101621', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text2 = (await res2.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx2 = text2.indexOf('736-81-01621');
  if (idx2 !== -1) {
    console.log('Bizno snippet:', text2.slice(Math.max(0, idx2 - 100), idx2 + 400));
  }

  console.log('\n=== 4. Checking "와이어드" 이지연 ===');
  const res3 = await fetch('https://search.naver.com/search.naver?query=' + encodeURIComponent('"와이어드" "이지연"'), { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text3 = (await res3.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let idx3 = text3.indexOf('이지연');
  while (idx3 !== -1) {
    console.log('Snippet 이지연:', text3.slice(Math.max(0, idx3 - 50), idx3 + 120));
    idx3 = text3.indexOf('이지연', idx3 + 1);
  }

  console.log('\n=== 5. Checking FTC 통신판매업 for 7368101621 ===');
  try {
    const res5 = await fetch('https://www.ftc.go.kr/bizCommPop.do?wrkr_no=7368101621', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text5 = (await res5.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones5 = text5.match(/(?:051|02|070|010)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('FTC phones:', phones5);
    let idx5 = text5.indexOf('이지연');
    if (idx5 !== -1) console.log('FTC snippet:', text5.slice(idx5 - 50, idx5 + 200));
  } catch(e) {}
}

probeWired();
