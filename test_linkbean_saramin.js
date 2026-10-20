const fs = require('fs');

async function fetchSaraminLinkbean() {
  const url = 'https://www.saramin.co.kr/zf_user/company-info/view/csn/TTlMZHR5M0pMcFZ3VU5rSGRCNzFndz09/company_nm/(%EC%A3%BC)%EB%A7%81%ED%81%AC%EB%B9%88';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  console.log('Saramin len:', html.length);
  const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
  console.log('All phones in Saramin:', [...new Set(phones || [])]);

  // check dt/dd for phone
  const telBlock = html.match(/(?:<dt>전화<\/dt>|<dt>대표번호<\/dt>|<dt>고객센터<\/dt>)[\s\S]*?<\/dd>/i);
  console.log('Tel block:', telBlock ? telBlock[0].replace(/<[^>]+>/g, ' ').trim() : 'NONE');

  // JSON-LD
  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLd) {
    console.log('JSON-LD:', jsonLd[1]);
  }
}

fetchSaraminLinkbean();
