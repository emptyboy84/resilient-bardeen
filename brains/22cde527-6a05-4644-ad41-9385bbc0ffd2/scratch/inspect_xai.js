const https = require('https');

async function inspect(b, label) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/article/' + b, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const m = d.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        console.log(`=== ${label} (${b}) ===`);
        console.log('Meta:', m ? m[1] : 'NONE');
        resolve();
      });
    });
  });
}

async function run() {
  await inspect('7298602952', '엑스에이아이에듀랩스 주식회사');
  await inspect('7948700687', '(주)위드마인드');
  await inspect('8226300346', '위드마인드');
}
run();
