const fs = require('fs');

async function searchSaramin() {
  const url = 'https://www.saramin.co.kr/zf_user/search/company?searchword=' + encodeURIComponent('저스티스어드벤처');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  const links = [...new Set(html.match(/\/company-info\/view[^\s"'<>]+/g) || [])];
  console.log('Saramin links:', links);
  for (const link of links) {
    const fullUrl = link.startsWith('http') ? link : 'https://www.saramin.co.kr' + link;
    const lRes = await fetch(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const lHtml = await lRes.text();
    fs.writeFileSync('justice_saramin.html', lHtml, 'utf8');
    console.log('Saved justice_saramin.html, length:', lHtml.length);
  }
}

searchSaramin();
