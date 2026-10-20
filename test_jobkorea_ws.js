const fs = require('fs');

async function fetchJobkorea() {
  const url = 'https://www.jobkorea.co.kr/Recruit/GI_Read/49349977';
  console.log('Fetching:', url);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Len:', html.length);
  fs.writeFileSync('ws_jobkorea.html', html, 'utf8');

  // find all phones
  const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
  console.log('Phones in Jobkorea:', [...new Set(phones || [])]);

  // find contact block
  const contactBlocks = html.match(/(?:담당자|문의처|접수방법|근무지|기업정보)[\s\S]{0,300}/gi) || [];
  contactBlocks.slice(0, 5).forEach((b, i) => {
    console.log(`\nBlock ${i + 1}:`);
    console.log(b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  });

  // find company info link
  const compLinks = html.match(/\/Company\/[0-9]+/g);
  console.log('Company links:', compLinks);
}

fetchJobkorea();
