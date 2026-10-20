const fs = require('fs');

async function checkNiceWs() {
  const biz = '4878800369';
  const url = `https://www.nicebizinfo.com/ep/EP0100M001GE.nice?itm_cmp_cd=${biz}`;
  console.log('Fetching Nice:', url);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Len:', html.length);
  fs.writeFileSync('ws_nice.html', html, 'utf8');

  // find kiscode
  const kis = html.match(/kiscode=([A-Z0-9]+)/i);
  console.log('KISCODE:', kis ? kis[1] : 'NONE');

  const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
  console.log('Phones in Nice:', [...new Set(phones || [])]);
}

checkNiceWs();
