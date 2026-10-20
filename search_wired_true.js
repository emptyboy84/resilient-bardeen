const https = require('https');

async function searchWiredTrue() {
  const bno = '7368101621';
  console.log('=== Checking Saramin for 7368101621 ===');
  try {
    const res = await fetch('https://www.saramin.co.kr/zf_user/search/company?searchword=' + bno, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|010)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Saramin phones:', phones);
    let idx = text.indexOf('이지연');
    if (idx !== -1) console.log(text.slice(idx - 50, idx + 200));
  } catch(e) {}

  console.log('\n=== Checking JobKorea for 7368101621 ===');
  try {
    const res = await fetch('https://www.jobkorea.co.kr/Search/?stext=' + bno, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|010)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('JobKorea phones:', phones);
  } catch(e) {}

  console.log('\n=== Checking Nice for 7368101621 ===');
  try {
    const res = await fetch('https://www.nicebizinfo.com/ep/EP0100M001GE.nice?itm_cmp_cd=' + bno, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|010)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Nice phones:', phones ? phones.filter(p => p !== '02-3771-1514') : []);
    let idx = text.indexOf('이지연');
    if (idx !== -1) console.log(text.slice(idx - 50, idx + 200));
  } catch(e) {}

  console.log('\n=== Checking 명진파크뷰 1동 803호 ===');
  try {
    const res = await fetch('https://search.naver.com/search.naver?query=' + encodeURIComponent('"명진파크뷰" "803호"'), { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const phones = text.match(/(?:051|02|070|010)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Apartment phones:', phones);
  } catch(e) {}
}

searchWiredTrue();
