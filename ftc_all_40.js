const https = require('https');
const qs = require('querystring');
const blanks = require('./thursday_blanks.json');

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
    const brno = t.bno.replace(/-/g, '');
    const postData = qs.stringify({ key: '232', searchCnd: 'BRNO', searchKrwd: brno });
    const req = https.request('https://www.ftc.go.kr/www/selectBizCommList.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
          if (tr.includes(brno)) {
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
              console.log(`\n★ [FTC MATCH! Seq ${t.seq} ${t.name}] 대표: ${t.ceo} | Phones:`, [...new Set(phones)]);
              console.log('   Table:', tText.substring(0, 400));
              resolve({ seq: t.seq, name: t.name, ceo: t.ceo, bno: t.bno, match: true, phones: [...new Set(phones)], text: tText });
            });
          }).on('error', e => resolve({ seq: t.seq, name: t.name, match: false, error: e.message }));
        } else {
          resolve({ seq: t.seq, name: t.name, match: false });
        }
      });
    });
    req.on('error', e => resolve({ seq: t.seq, name: t.name, match: false, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ seq: t.seq, name: t.name, match: false, error: 'timeout' }); });
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('Querying FTC for 40 companies...');
  const cookie = await getCookie();
  const results = [];
  for (let i = 0; i < blanks.length; i++) {
    const t = blanks[i];
    process.stdout.write(`[${i+1}/${blanks.length}] Seq ${t.seq} ${t.name}... `);
    const res = await searchFtc(cookie, t);
    if (res.match) {
      results.push(res);
    } else {
      console.log('미등재');
    }
    await new Promise(r => setTimeout(r, 250));
  }
  console.log('\n=== FTC SCAN FINISHED ===');
  console.log(`Found ${results.length} FTC registered companies among 40 blanks.`);
}
run();
