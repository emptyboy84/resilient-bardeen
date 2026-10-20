const https = require('https');

async function searchSaramin() {
  const q = encodeURIComponent('유네이드홀딩스');
  const url = 'https://www.saramin.co.kr/zf_user/search/company?searchword=' + q;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  console.log('Len:', html.length);
  const regex = /\/zf_user\/company-info\/view[^\s"'<>]+/g;
  let match;
  const links = new Set();
  while ((match = regex.exec(html)) !== null) {
    links.add(match[0]);
  }
  console.log('Saramin links:', Array.from(links));
  for (const l of Array.from(links)) {
    const dUrl = 'https://www.saramin.co.kr' + l;
    const dRes = await fetch(dUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const dHtml = await dRes.text();
    const phones = dHtml.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones in ' + l + ':', phones ? Array.from(new Set(phones)) : []);
    const clean = dHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    let idx = clean.indexOf('이병상');
    if (idx !== -1) console.log(clean.slice(idx, idx + 300));
  }
}
searchSaramin();
