const https = require('https');

function checkBizno(bno) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/article/' + bno, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const matches = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
        for (const m of matches) {
          const clean = m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          if (/상태|전화|대표|주소|등록번호|상호|개업|폐업/.test(clean)) {
            console.log('Bizno row:', clean);
          }
        }
        const meta = d.match(/<meta[^>]*content="[^"]*사업자 현재 상태[^"]*"/i);
        console.log('Bizno meta:', meta ? meta[0] : 'none');
        resolve();
      });
    }).on('error', e => resolve(console.error(e)));
  });
}

checkBizno('6478802498');
