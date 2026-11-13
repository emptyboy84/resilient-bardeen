const https = require('https');
const qs = require('querystring');

const targets = [
  { seq: 1412, name: '스튜디오와이비', ceo: '송유빈', bno: '362-93-01985', addr: '부산 연제구 연수로148번길 8-44 (연산동)' },
  { seq: 1413, name: '엠디스튜디오', ceo: '강지훈', bno: '387-04-03218', addr: '부산 부산진구 전포대로176번길 17, 604호 (전포동,전포센티움)' },
  { seq: 1414, name: '와츄디', ceo: '황선하', bno: '594-13-02032', addr: '부산 금정구 벅구산로 7, 1402호 (남산동,국제그린파크)' },
  { seq: 1415, name: '아이비뮤직댄스콘텐츠', ceo: '최영수', bno: '614-04-54531', addr: '부산 금정구 부산대학로 39, 5층 (장전동)' },
  { seq: 1416, name: '루프노트', ceo: '정현수', bno: '196-93-02034', addr: '부산 수영구 광남로 89, 206호 (광안동,글로벌하일타운)' },
  { seq: 1417, name: '제이픽쳐스', ceo: '최재준', bno: '406-32-01213', addr: '부산 북구 만덕1로104번길 29, 108동 1006호 (덕천동,기비골마을)' },
  { seq: 1418, name: '피나이아줌마', ceo: 'CABUELLO JOVELYN', bno: '768-90-01969', addr: '부산 기장군 정관읍 정관2로 24, 201동 1202호 (모전리,휴먼시아2차아파트)' },
  { seq: 1419, name: '스위치스튜디오', ceo: '김태원', bno: '403-27-01258', addr: '부산 수영구 좌수영로 192, 304동 1603호 (망미동,수영강변e편한세상3차)' },
  { seq: 1420, name: '응아뽕', ceo: '김재열', bno: '314-40-00977', addr: '부산 해운대구 수영강변대로 140, 5층 콘텐츠코리아 랩 오픈오피스(우동,부산문화콘텐츠컴플렉스)' },
  { seq: 1421, name: '류류이엔티', ceo: '이승경', bno: '728-11-02738', addr: '부산 금정구 금정로233번길 41 (구서동)' },
  { seq: 1422, name: '왓츠비', ceo: '김덕원', bno: '482-09-03236', addr: '부산 남구 용소로14번길 30, L동 2층 1호(대연동,스케일업)' },
  { seq: 1423, name: '킨레', ceo: '정승원', bno: '283-23-02465', addr: '부산 기장군 정관읍 산단2로 60, 502동 602호 (달산리,엘에이치5단지)' },
  { seq: 1424, name: '아랫집해파리', ceo: '변서영', bno: '493-43-01192', addr: '부산 동구 초량중로 11-1, 1층 (초량동)' },
  { seq: 1425, name: '디슈팀메', ceo: '김효빈', bno: '654-90-01826', addr: '부산 수영구 황령산로7번길 45, 헤리티지 남천 601호 (남천동)' },
  { seq: 1426, name: '챔팩미디어', ceo: '김태연', bno: '497-36-01444', addr: '부산 영도구 태종로292번길 12, 403호 (청학동,동삼빌리지)' },
  { seq: 1427, name: '레디액션', ceo: '박준영', bno: '601-09-92780', addr: '부산 금정구 금샘로 501-1, 2층 레디액션 (남산동)' }
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

    // 3. FTC
    const ftcRes = await searchFtc(ftcCookie, bnoClean);
    if (ftcRes.match) {
      console.log('--- FTC 통신판매 MATCH! ---');
      console.log('  Phones:', ftcRes.phones);
      console.log('  Text snippet:', ftcRes.text.substring(0, 400));
    } else {
      console.log('--- FTC 통신판매: 미등재 ---');
    }

    await new Promise(r => setTimeout(r, 350));
  }
}

main();
