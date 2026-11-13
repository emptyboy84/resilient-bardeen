const https = require('https');
const qs = require('querystring');
const fs = require('fs');

async function getFtcDetail() {
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
        if (tr.includes('1490901665') || tr.includes('조홍제') || tr.includes('유라보')) {
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
            fs.writeFileSync('ftc_urabo_view.html', vd);
            const tables = vd.match(/<table[\s\S]*?<\/table>/gi) || [];
            if (tables.length) {
              console.log('FTC Urabo Detail:\n', tables[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
            }
          });
        });
      }
    });
  });
  req.write(postData);
  req.end();
}
getFtcDetail();
