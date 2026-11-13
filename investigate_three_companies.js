const https = require('https');

const companies = [
  { seq: 990, row: 991, name: '(주)율시스', ceo: '이용이', bno: '8718801980', bnoRaw: '871-88-01980' },
  { seq: 991, row: 992, name: '(주)파트너잇', ceo: '김남훈', bno: '8658703332', bnoRaw: '865-87-03332' },
  { seq: 992, row: 993, name: '디라이브(주)', ceo: '두강명', bno: '7088703567', bnoRaw: '708-87-03567' }
];

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
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
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
  for (const c of companies) {
    console.log(`\n========================================`);
    console.log(`[Seq ${c.seq} / Row ${c.row}] ${c.name} (${c.bnoRaw}, 대표: ${c.ceo})`);
    console.log(`========================================`);
    const biz = await checkBizno(c.bno);
    console.log('--- Bizno Data ---');
    biz.rows.forEach(r => console.log('  ', r));
    console.log('  Meta:', biz.meta);

    const mbz = await checkMarketbz(c.bno);
    console.log('--- MarketBZ Data ---');
    console.log('  Desc:', mbz);
  }
}

main();
