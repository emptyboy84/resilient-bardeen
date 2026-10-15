const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/json',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: d, headers: res.headers }));
    }).on('error', err => resolve({ status: 500, error: err.message }));
  });
}

async function test() {
  console.log('Testing moneypin.biz...');
  const res1 = await fetchUrl('https://moneypin.biz');
  console.log('Status moneypin.biz:', res1.status, 'len:', (res1.data || '').length);

  // Check common moneypin endpoints
  const endpoints = [
    'https://moneypin.biz/bizno',
    'https://moneypin.biz/bizno/',
    'https://moneypin.biz/company',
    'https://biz.moneypin.biz'
  ];

  for (const ep of endpoints) {
    const r = await fetchUrl(ep);
    console.log(`Endpoint ${ep}: status=${r.status}, len=${(r.data || '').length}`);
    if (r.data && r.data.includes('사업자')) {
      console.log(`  -> Found '사업자' in ${ep}`);
    }
  }
}

test();
