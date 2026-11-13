const https = require('https');
const qs = require('querystring');
const fs = require('fs');

const ftcTargets = [
  { no: 1049, name: '(주)바이너리티', brno: '4618602513' },
  { no: 1054, name: '(주)혜성씨앤디', brno: '3988603344' },
  { no: 1072, name: '(주)제니원', brno: '5248601718' },
  { no: 1074, name: '(주)큐큐', brno: '4708702299' },
  { no: 1124, name: '(주)디지콘', brno: '5548102616' },
  { no: 1155, name: '(주)위클리벤처스', brno: '2988103146' }
];

async function getCookie() {
  return new Promise(resolve => {
    https.get('https://www.ftc.go.kr/www/selectBizCommList.do?key=232', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      const setCookie = res.headers['set-cookie'];
      resolve(setCookie ? setCookie.map(x => x.split(';')[0]).join('; ') : '');
    });
  });
}

function searchFtc(cookie, t) {
  return new Promise(resolve => {
    const postData = qs.stringify({ key: '232', searchCnd: 'BRNO', searchKrwd: t.brno });
    const req = https.request('https://www.ftc.go.kr/www/selectBizCommList.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
        'Cookie': cookie,
        'Referer': 'https://www.ftc.go.kr/www/selectBizCommList.do?key=232'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const trs = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
        let viewUrl = null;
        trs.forEach(tr => {
          if (tr.includes(t.brno)) {
            const m = tr.match(/href="(\.\/selectBizCommView\.do[^"]+)"/);
            if (m) viewUrl = m[1].replace(/&amp;/g, '&');
          }
        });
        if (viewUrl) {
          const fullUrl = 'https://www.ftc.go.kr/www/' + viewUrl.replace('./', '');
          https.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookie } }, vRes => {
            let vd = '';
            vRes.on('data', c => vd += c);
            vRes.on('end', () => {
              const tables = vd.match(/<table[\s\S]*?<\/table>/gi) || [];
              const tText = tables.length ? tables[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') : '';
              console.log(`\n=== [FTC ${t.no} ${t.name}] ===\n`, tText);
              resolve({ ...t, ftc: tText });
            });
          });
        } else {
          console.log(`\n=== [FTC ${t.no} ${t.name}] 미등재 ===`);
          resolve({ ...t, ftc: null });
        }
      });
    });
    req.write(postData);
    req.end();
  });
}

async function run() {
  const cookie = await getCookie();
  for (const t of ftcTargets) {
    await searchFtc(cookie, t);
  }
}
run();
