const https = require('https');

function fetchMoneypin(bizNo) {
  return new Promise((resolve) => {
    const url = `https://api.moneypin.biz/biz/info/${bizNo}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function main() {
  const res = await fetchMoneypin('6468702732');
  console.log('Moneypin API:', res.status, res.data.substring(0, 500));
}

main();
