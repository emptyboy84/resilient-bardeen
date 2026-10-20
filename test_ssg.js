const fs = require('fs');

async function checkSsg() {
  const res = await fetch('https://www.ssg.com/sellerhome/214249/main.ssg', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  console.log('SSG PC len:', html.length);
  const ftc = html.match(/https?:\/\/www\.ftc\.go\.kr\/bizCommPop\.do\?[^"'\s]+/gi);
  console.log('FTC links:', ftc);
  const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
  console.log('All phones in SSG PC:', phones);

  // find seller contact
  const sellerSnippet = html.match(/(?:상호|대표자|사업자등록번호|고객센터|연락처|통신판매업)[\s\S]{0,100}/g);
  console.log('Seller snippets:', sellerSnippet?.slice(0, 10));
}

checkSsg();
