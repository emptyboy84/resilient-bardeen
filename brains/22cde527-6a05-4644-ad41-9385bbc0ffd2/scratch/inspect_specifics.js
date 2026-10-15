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
  await inspect('4018602715', '인우랩');
  await inspect('8078703087', '아크리아스튜디오');
  await inspect('1488803253', '메쉬링크');
}
run();
