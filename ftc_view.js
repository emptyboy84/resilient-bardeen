const https = require('https');
const fs = require('fs');

async function getView() {
  const cookie = await new Promise((resolve) => {
    https.get('https://www.ftc.go.kr/www/selectBizCommList.do?key=232', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, res => {
      const setCookie = res.headers['set-cookie'];
      const c = setCookie ? setCookie.map(x => x.split(';')[0]).join('; ') : '';
      resolve(c);
    });
  });

  const url = 'https://www.ftc.go.kr/www/selectBizCommView.do?pageUnit=10&pageIndex=1&searchCnd=BRNO&searchKrwd=5295500699&key=232&opnSn=2022329014430200368';
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': cookie,
      'Referer': 'https://www.ftc.go.kr/www/selectBizCommList.do?key=232'
    }
  }, res => {
    console.log('View status:', res.statusCode);
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log('View len:', d.length);
      fs.writeFileSync('ftc_view_bss.html', d);
    });
  });
}

getView();
