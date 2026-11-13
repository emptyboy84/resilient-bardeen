const https = require('https');
const qs = require('querystring');
const fs = require('fs');

async function searchFTC() {
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

  const postData = qs.stringify({
    key: '232',
    searchCnd: 'BRNO',
    searchKrwd: '1398603518'
  });

  const req = https.request('https://www.ftc.go.kr/www/selectBizCommList.do', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': cookie,
      'Referer': 'https://www.ftc.go.kr/www/selectBizCommList.do?key=232'
    }
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log('Result length:', d.length);
      fs.writeFileSync('ftc_saladbowl.html', d);
      
      const trs = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
      trs.forEach(tr => {
        if (tr.includes('샐러드볼') || tr.includes('최정희') || tr.includes('1398603518')) {
          console.log('Found TR:', tr);
        }
      });
    });
  });

  req.write(postData);
  req.end();
}

searchFTC();
