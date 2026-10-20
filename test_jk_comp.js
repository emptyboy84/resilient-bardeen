const fs = require('fs');

async function searchJobkoreaCompany() {
  const url = 'https://www.jobkorea.co.kr/Search/?stext=' + encodeURIComponent('더블유에스컴퍼니') + '&tabType=corp';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  console.log('Len:', html.length);
  const links = [...new Set(html.match(/\/Company\/[0-9]+/g) || [])];
  console.log('Company links in Jobkorea:', links);

  for (const l of links) {
    const cUrl = 'https://www.jobkorea.co.kr' + l;
    const cRes = await fetch(cUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const cHtml = await cRes.text();
    const phones = cHtml.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
    console.log(l, 'Phones:', [...new Set(phones || [])]);
    const idx = cHtml.indexOf('센텀');
    if (idx !== -1) {
      console.log('  Centum found in ' + l + '!');
      console.log('  Snippet:', cHtml.substring(Math.max(0, idx - 100), Math.min(cHtml.length, idx + 200)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    }
  }
}

searchJobkoreaCompany();
