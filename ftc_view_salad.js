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

  const url = 'https://www.ftc.go.kr/www/selectBizCommView.do?pageUnit=10&pageIndex=1&searchCnd=BRNO&searchKrwd=1398603518&key=232&opnSn=2025339010930200357';
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': cookie,
      'Referer': 'https://www.ftc.go.kr/www/selectBizCommList.do?key=232'
    }
  }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log('View len:', d.length);
      fs.writeFileSync('ftc_view_salad.html', d);
      
      const tableMatches = d.match(/<table[\s\S]*?<\/table>/gi) || [];
      tableMatches.forEach((t, i) => {
        const text = t.replace(/<[^>]+>/g, '\n').split('\n').map(l => l.trim()).filter(Boolean).join(' | ');
        console.log(`Table ${i}:`, text);
      });
    });
  });
}

getView();
