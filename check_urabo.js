const https = require('https');
const qs = require('querystring');

async function checkBizno() {
  return new Promise(resolve => {
    https.get('https://bizno.net/article/1490901665', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const statusIdx = d.indexOf('사업자 현재 상태');
        if (statusIdx !== -1) {
          console.log('BIZNO NTS snippet:', d.substring(statusIdx, statusIdx + 200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
        }
        const m = d.match(/<table[\s\S]*?<\/table>/gi) || [];
        m.forEach((t, i) => {
          console.log(`Table ${i}:\n`, t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
        });
        resolve();
      });
    });
  });
}

async function searchFtc() {
  const cookie = await new Promise(resolve => {
    https.get('https://www.ftc.go.kr/www/selectBizCommList.do?key=232', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      const setCookie = res.headers['set-cookie'];
      const c = setCookie ? setCookie.map(x => x.split(';')[0]).join('; ') : '';
      resolve(c);
    });
  });

  const postData = qs.stringify({
    key: '232',
    searchCnd: 'BRNO',
    searchKrwd: '1490901665'
  });

  return new Promise(resolve => {
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
        console.log('FTC res len:', d.length);
        const trs = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
        trs.forEach(tr => {
          if (tr.includes('1490901665') || tr.includes('조홍제') || tr.includes('유라보')) {
            console.log('FTC TR:', tr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
          }
        });
        resolve();
      });
    });
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- 1. BIZNO ---');
  await checkBizno();
  console.log('\n--- 2. FTC ---');
  await searchFtc();
}
run();
