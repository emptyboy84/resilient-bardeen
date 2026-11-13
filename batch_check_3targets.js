const https = require('https');
const qs = require('querystring');
const fs = require('fs');

const targets = [
  { no: 1149, name: '심테크솔루션', ceo: '이상혁', brno: '5091001539' },
  { no: 1150, name: '(주)코라소프트', ceo: '고선균', brno: '4668702757' },
  { no: 1151, name: '(주)디웰랩', ceo: '김동현', brno: '1358703885' }
];

async function checkBizno(t) {
  return new Promise(resolve => {
    https.get(`https://bizno.net/article/${t.brno}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const statusMatch = text.match(/사업자 현재 상태\s*([^※<]+)/);
        const status = statusMatch ? statusMatch[1].replace(/&nbsp;/g, '').trim() : '';
        const phoneMatch = text.match(/전화번호\s*([0-9-]{9,14})/);
        const teleNoMatch = text.match(/통신판매업번호\s*([^ ]+)/);
        const addrMatch = text.match(/회사주소\s*([^관]+)/);
        const taxOfficeMatch = text.match(/관할세무서\s*([^ ]+)/);
        const estDateMatch = text.match(/등록일\s*([^ ]+)/);
        
        console.log(`=== [${t.no}] ${t.name} (${t.brno}) ===`);
        console.log('상태:', status);
        console.log('등록일:', estDateMatch ? estDateMatch[1] : '없음');
        console.log('통신판매업번호:', teleNoMatch ? teleNoMatch[1] : '없음');
        console.log('회사주소:', addrMatch ? addrMatch[1].trim() : '없음');
        console.log('관할세무서:', taxOfficeMatch ? taxOfficeMatch[1] : '없음');
        console.log('전화번호 매칭:', phoneMatch ? phoneMatch[1] : '없음');
        resolve({ ...t, status, addr: addrMatch ? addrMatch[1].trim() : '', teleNo: teleNoMatch ? teleNoMatch[1] : null });
      });
    });
  });
}

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

function searchFtc(cookie, t) {
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
