const https = require('https');
const qs = require('querystring');

async function searchFtcText(keyword) {
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
    searchCnd: 'BOPMNM',
    searchKrwd: keyword
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
      console.log(`Keyword "${keyword}" TRs:`, trs.length);
      trs.forEach(tr => {
        console.log(tr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
      });
    });
  });
  req.write(postData);
  req.end();
}

searchFtcText('마인드코어');
