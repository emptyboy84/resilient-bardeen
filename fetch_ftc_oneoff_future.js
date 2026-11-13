const https = require('https');
const qs = require('querystring');

async function searchFtcBrno(brno, name) {
  const cookie = await new Promise(resolve => {
    https.get('https://www.ftc.go.kr/www/selectBizCommList.do?key=232', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      const setCookie = res.headers['set-cookie'];
      resolve(setCookie ? setCookie.map(x => x.split(';')[0]).join('; ') : '');
    });
  });

  const postData = qs.stringify({ key: '232', searchCnd: 'BRNO', searchKrwd: brno });
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
      trs.forEach(tr => {
        if (tr.includes(brno)) {
          const m = tr.match(/href="(\.\/selectBizCommView\.do[^"]+)"/);
          if (m) {
            const fullUrl = 'https://www.ftc.go.kr/www/' + m[1].replace('./', '').replace(/&amp;/g, '&');
            https.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookie } }, vRes => {
              let vd = '';
              vRes.on('data', c => vd += c);
              vRes.on('end', () => {
                const tables = vd.match(/<table[\s\S]*?<\/table>/gi) || [];
                if (tables.length) {
                  console.log(`[FTC DETAIL ${name} ${brno}]:\n`, tables[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
                }
              });
            });
          }
        }
      });
    });
  });
  req.write(postData);
  req.end();
}

searchFtcBrno('8444500755', '원오프');
searchFtcBrno('6608802924', '(주)찬란한미래');
