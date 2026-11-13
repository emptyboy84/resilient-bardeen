const https = require('https');
const qs = require('querystring');

const targets = [
  { seq: 1375, name: '애씨드클라우드', ceo: '고관우', bno: '307-18-20237', addr: '' },
  { seq: 1376, name: '캠버스출판사', ceo: '한장석', bno: '621-12-91728', addr: '부산 부산진구 동천로 70, 304호 (전포동,서면쌍용플래티넘)' },
  { seq: 1377, name: '드림오더', ceo: '박한백', bno: '817-23-01328', addr: '부산 부산진구 범전로 7, 101동 1403호(부전동,디에이션파크부산)' },
  { seq: 1378, name: '롤플릭스', ceo: '최민규', bno: '759-97-01722', addr: '부산 부산진구 부전로96번길 7, 4층 401-S214호 (부전동)' },
  { seq: 1379, name: '1분판다', ceo: '안성용', bno: '149-92-01750', addr: '부산 기장군 일광읍 이천1길 12-8(이천리)' },
  { seq: 1380, name: '르몽드저놈', ceo: '김명준', bno: '668-98-01781', addr: '부산 사상구 주감로 245 (주례동)' }
];

function fetchUrl(url, headers = {}) {
  return new Promise((resolve) => {
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    https.get(url, { headers: { ...defaultHeaders, ...headers }, timeout: 7000 }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: d }));
    }).on('error', e => resolve({ error: e.message }))
      .on('timeout', () => resolve({ error: 'timeout' }));
  });
}

async function getFtcCookie() {
  return new Promise(resolve => {
    https.get('https://www.ftc.go.kr/www/selectBizCommList.do?key=232', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      const setCookie = res.headers['set-cookie'];
      resolve(setCookie ? setCookie.map(x => x.split(';')[0]).join('; ') : '');
    });
  });
}

function searchFtc(cookie, bnoClean) {
  return new Promise(resolve => {
    const postData = qs.stringify({ key: '232', searchCnd: 'BRNO', searchKrwd: bnoClean });
    const req = https.request('https://www.ftc.go.kr/www/selectBizCommList.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
        'Cookie': cookie,
        'Referer': 'https://www.ftc.go.kr/www/selectBizCommList.do?key=232'
      },
      timeout: 8000
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const trs = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
        let viewUrl = null;
        trs.forEach(tr => {
          if (tr.includes(bnoClean)) {
            const m = tr.match(/href="(\.\/selectBizCommView\.do[^"]+)"/);
            if (m) viewUrl = m[1].replace(/&amp;/g, '&');
          }
        });
        if (viewUrl) {
          const fullUrl = 'https://www.ftc.go.kr/www/' + viewUrl.replace('./', '');
          https.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookie }, timeout: 8000 }, vRes => {
            let vd = '';
            vRes.on('data', c => vd += c);
            vRes.on('end', () => {
              const tables = vd.match(/<table[\s\S]*?<\/table>/gi) || [];
              const tText = tables.length ? tables[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') : '';
              const phones = tText.match(/(?:010|051|070|02|031|052|055|15\d{2}|16\d{2}|18\d{2})[- ]?\d{3,4}[- ]?\d{4}/g) || [];
              resolve({ match: true, text: tText, phones: [...new Set(phones)] });
            });
          }).on('error', e => resolve({ match: false, error: e.message }));
        } else {
          resolve({ match: false });
        }
      });
    });
    req.on('error', e => resolve({ match: false, error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function main() {
  const ftcCookie = await getFtcCookie();

  for (const t of targets) {
    const bnoClean = t.bno.replace(/-/g, '');
    console.log(`\n============================================================`);
    console.log(`[Seq ${t.seq}] ${t.name} (대표: ${t.ceo}, 사업자: ${t.bno})`);
    console.log(`============================================================`);

    // 1. Bizno
    const bizRes = await fetchUrl(`https://bizno.net/article/${bnoClean}`);
    if (bizRes.data) {
      const trs = bizRes.data.match(/<tr[\s\S]*?<\/tr>/gi) || [];
      const relevantTrs = [];
      for (const tr of trs) {
        const clean = tr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (/전화|팩스|주소|상태|대표|개업/.test(clean)) relevantTrs.push(clean);
      }
      console.log('--- Bizno Data ---');
      relevantTrs.forEach(r => console.log('  ', r));
    }

    // 2. MarketBZ
    const mbzRes = await fetchUrl(`https://marketbz.com/companyDetail/${bnoClean}`);
    if (mbzRes.data) {
      const m = mbzRes.data.match(/"description":"([^"]+)"/);
      if (m) console.log('--- MarketBZ ---:', m[1]);
    }

    // 3. FTC
    const ftcRes = await searchFtc(ftcCookie, bnoClean);
    if (ftcRes.match) {
      console.log('--- FTC 통신판매 MATCH! ---');
      console.log('  Phones:', ftcRes.phones);
      console.log('  Text snippet:', ftcRes.text.substring(0, 400));
    } else {
      console.log('--- FTC 통신판매: 미등재 ---');
    }

    await new Promise(r => setTimeout(r, 400));
  }
}

main();
