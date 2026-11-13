const https = require('https');
const qs = require('querystring');
const fs = require('fs');

const targets = [
  { seq: 1312, name: '(주)이엔비파트너스', ceo: '배명효', bno: '561-87-01863', corpNo: '180111-1311636', addr: '부산 부산진구 동천로 116, 714호 (전포동,한신밴오피스텔)' },
  { seq: 1313, name: '(주)가은테크', ceo: '안영수', bno: '470-86-02399', corpNo: '180111-1379634', addr: '부산 남구 수영로 294, 1108호 (대연동,대연동동일스위트)' },
  { seq: 1314, name: '엘지헬로우비전가입센터', ceo: '이미랑', bno: '470-27-01170', corpNo: '', addr: '부산 동래구 아시아드대로 234, 106동 1801호 (온천동,온천동반도보라스카이)' },
  { seq: 1315, name: '엔아이에스', ceo: '한창훈', bno: '528-15-00744', corpNo: '', addr: '부산 동래구 삼어로 12, 204동 2403호 (안락동,SK쁘띠메종아파트)' },
  { seq: 1316, name: '연금술', ceo: '김보광', bno: '529-35-01176', corpNo: '', addr: '부산 북구 덕천로259번길 30, 종합상가 6동 2층 201호 (만덕동,대성)' },
  { seq: 1317, name: '마이플랫폼(주)', ceo: '박선희', bno: '565-86-01169', corpNo: '170111-0710162', addr: '부산 해운대구 세실로 86, 3층 1-1호 (좌동)' },
  { seq: 1318, name: '(주)한살', ceo: '이민형', bno: '734-86-03574', corpNo: '180111-1577527', addr: '부산 해운대구 해운대로 620, 317호 (우동,해운대라뮤에뜨)' },
  { seq: 1319, name: '고미', ceo: '문창만', bno: '607-09-97046', corpNo: '', addr: '부산 부산진구 동평로183번길 67, 107동 2003호(연지동,연지자이아파트1차)' },
  { seq: 1320, name: '그래서젊다', ceo: '박소영', bno: '704-98-01490', corpNo: '', addr: '부산 동래구 금정마을로 147, 108동 1501호(온천동,동래래미안아이파크)' },
  { seq: 1321, name: '(주)한국보훈디지털뉴스', ceo: '최석진', bno: '219-88-02589', corpNo: '180111-1474997', addr: '부산 영도구 태종로 40, 2층 201호 (대교동1가,브리짓타워)' }
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
    console.log(`주소: ${t.addr}`);
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

    // 3. FTC 통신판매
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
