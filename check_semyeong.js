const https = require('https');

function checkBizno(bno) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/article/' + bno, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const rows = [];
        const matches = d.match(/<tr[\s\S]*?<\/tr>/gi) || [];
        for (const m of matches) {
          const clean = m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          if (/상태|전화|대표|주소|등록번호|상호|개업|폐업|세무서/.test(clean)) {
            rows.push(clean);
          }
        }
        const meta = d.match(/<meta[^>]*content="[^"]*사업자 현재 상태[^"]*"/i);
        resolve({ rows, meta: meta ? meta[0] : '' });
      });
    }).on('error', e => resolve({ rows: [], error: e.message }));
  });
}

function checkMarketbz(bno) {
  return new Promise((resolve) => {
    https.get('https://marketbz.com/companyDetail/' + bno, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const mDesc = d.match(/"description":"([^"]+)"/);
        resolve(mDesc ? mDesc[1] : 'none');
      });
    }).on('error', e => resolve('error: ' + e.message));
  });
}

async function main() {
  console.log('=== Checking 672-86-03048 ((주)세명) ===');
  const biz = await checkBizno('6728603048');
  biz.rows.forEach(r => console.log('  Bizno:', r));
  console.log('  Meta:', biz.meta);

  const mbz = await checkMarketbz('6728603048');
  console.log('  MarketBZ:', mbz);
}

main();
