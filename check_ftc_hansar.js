const https = require('https');
const qs = require('querystring');

async function checkFtcHansar() {
  const cookie = await new Promise(r => {
    https.get('https://www.ftc.go.kr/www/selectBizCommList.do?key=232', res => {
      r(res.headers['set-cookie']?.map(x => x.split(';')[0]).join('; ') || '');
    });
  });

  // search by 통신판매번호: 1339 or 상호 한살
  const postData = qs.stringify({ key: '232', searchCnd: 'BMAN_NM', searchKrwd: '한살' });
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
        if (tr.includes('734-86-03574') || tr.includes('한살') || tr.includes('이민형')) {
          console.log('TR:', tr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
          const m = tr.match(/href="(\.\/selectBizCommView\.do[^"]+)"/);
          if (m) {
            const url = 'https://www.ftc.go.kr/www/' + m[1].replace('./', '').replace(/&amp;/g, '&');
            https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookie } }, vRes => {
              let vd = '';
              vRes.on('data', c => vd += c);
              vRes.on('end', () => {
                const table = vd.match(/<table[\s\S]*?<\/table>/gi)?.[0] || '';
                console.log('Detail:\n', table.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
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
checkFtcHansar();
