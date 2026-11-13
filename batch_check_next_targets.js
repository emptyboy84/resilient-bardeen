const https = require('https');
const qs = require('querystring');

const targets = [
  { no: 1180, row: 1181, name: '자연앤과학', ceo: '김정희', brno: '5039527260', addr: '부산 동구 중앙대로 527, 5층 (범일동)' },
  { no: 1181, row: 1182, name: '(주)부산인디드', ceo: '김현철', brno: '1648803589', addr: '부산 기장군 정관읍 정관3로 23, 정관동일스위트2차 201(1806)' },
  { no: 1182, row: 1183, name: '(주)영아일랜드', ceo: '양황아', brno: '6558603742', addr: '부산 중구 충장대로5번길 12, 3층 304호 (중앙동4가)' },
  { no: 1184, row: 1185, name: '원오프', ceo: '장서은', brno: '8444500755', addr: '부산 해운대구 센텀중앙로 97, A동 3404호 (재송동,센텀스카이비즈)' },
  { no: 1185, row: 1186, name: '(주)찬란한미래', ceo: '김수로', brno: '6608802924', addr: '부산 연제구 법원로32번길 10, 401호 (거제동,에이스빌딩)' }
];

async function checkBizno(t) {
  return new Promise(resolve => {
    https.get(`https://bizno.net/article/${t.brno}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const statusIdx = d.indexOf('사업자 현재 상태');
        let status = '확인불가';
        if (statusIdx !== -1) {
          status = d.substring(statusIdx, statusIdx + 150).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        }
        const teleIdx = d.indexOf('통신판매업번호');
        let tele = '없음';
        if (teleIdx !== -1) {
          tele = d.substring(teleIdx, teleIdx + 50).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        }
        const addrIdx = d.indexOf('회사주소');
        let addr = '없음';
        if (addrIdx !== -1) {
          addr = d.substring(addrIdx, addrIdx + 120).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        }
        console.log(`[${t.no} ${t.name}] Status: ${status} | Tele: ${tele} | Addr: ${addr}`);
        resolve({ ...t, status, tele, addr });
      });
    });
  });
}

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
  console.log('--- 1. BIZNO & NTS CHECK ---');
  for (const t of targets) {
    await checkBizno(t);
  }
  console.log('\n--- 2. FTC CHECK ---');
  const cookie = await getCookie();
  for (const t of targets) {
    await searchFtc(cookie, t);
  }
}
run();
