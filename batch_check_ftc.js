const https = require('https');
const qs = require('querystring');
const fs = require('fs');

const targets = [
  { no: 1128, name: '(주)엑스비트', brno: '7838803473' },
  { no: 1129, name: '(주)트리플아이', brno: '3428703071' },
  { no: 1130, name: '비비스로지틱스', brno: '8350203047' },
  { no: 1131, name: '터틀필름', brno: '1725600700' },
  { no: 1132, name: '(주)마인드코어', brno: '2188703841' },
  { no: 1133, name: '솔민상사', brno: '2431900875' }
];

async function getCookie() {
  return new Promise(resolve => {
    https.get('https://www.ftc.go.kr/www/selectBizCommList.do?key=232', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      const setCookie = res.headers['set-cookie'];
      const c = setCookie ? setCookie.map(x => x.split(';')[0]).join('; ') : '';
      resolve(c);
    });
  });
}

function searchFtcOne(cookie, t) {
  return new Promise(resolve => {
    const postData = qs.stringify({
      key: '232',
      searchCnd: 'BRNO',
      searchKrwd: t.brno
    });
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
          https.get(fullUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookie }
          }, vRes => {
            let vd = '';
            vRes.on('data', c => vd += c);
            vRes.on('end', () => {
              fs.writeFileSync(`ftc_${t.no}.html`, vd);
              const tables = vd.match(/<table[\s\S]*?<\/table>/gi) || [];
              const tText = tables.length ? tables[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') : '';
              console.log(`[FTC ${t.no} ${t.name}] DETAILED:\n`, tText.substring(0, 500));
              resolve({ ...t, ftc: tText });
            });
          });
        } else {
          console.log(`[FTC ${t.no} ${t.name}] 통신판매 내역 없음`);
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
  for (const t of targets) {
    await searchFtcOne(cookie, t);
  }
}
run();
