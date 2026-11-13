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
    searchKrwd: '7672301358'
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
    res.on('end', async () => {
      console.log('Search res len:', d.length);
      fs.writeFileSync('ftc_welford_list.html', d);
      
      const trs = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
      let viewUrl = null;
      trs.forEach(tr => {
        if (tr.includes('웰포드') || tr.includes('김현준') || tr.includes('7672301358')) {
          console.log('Found TR:', tr);
          const m = tr.match(/href="(\.\/selectBizCommView\.do[^"]+)"/);
          if (m) viewUrl = m[1].replace(/&amp;/g, '&');
        }
      });

      if (viewUrl) {
        console.log('Fetching view URL:', viewUrl);
        const fullUrl = 'https://www.ftc.go.kr/www/' + viewUrl.replace('./', '');
        https.get(fullUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Cookie': cookie,
            'Referer': 'https://www.ftc.go.kr/www/selectBizCommList.do?key=232'
          }
        }, vRes => {
          let vd = '';
          vRes.on('data', c => vd += c);
          vRes.on('end', () => {
            console.log('View len:', vd.length);
            fs.writeFileSync('ftc_welford_view.html', vd);
            const tables = vd.match(/<table[\s\S]*?<\/table>/gi) || [];
            tables.forEach((t, i) => {
              const text = t.replace(/<[^>]+>/g, '\n').split('\n').map(l=>l.trim()).filter(Boolean).join(' | ');
              console.log(`Table ${i}:`, text);
            });
          });
        });
      }
    });
  });

  req.write(postData);
  req.end();
}

searchFTC();
