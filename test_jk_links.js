const fs = require('fs');

async function check() {
  const url = 'https://www.jobkorea.co.kr/Search/?stext=' + encodeURIComponent('더블유에스컴퍼니');
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const cLinks = [...new Set(html.match(/\/company\/[a-zA-Z0-9_\/.-]+/gi) || [])];
  console.log('Company links:', cLinks);
  const giLinks = [...new Set(html.match(/\/Recruit\/GI_Read\/[0-9]+/gi) || [])];
  console.log('GI links:', giLinks);
}
check();
