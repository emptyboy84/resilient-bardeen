const https = require('https');

function check(b) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/article/' + b.replace(/-/g, ''), { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const m = d.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        resolve({ b, meta: m ? m[1] : 'NOT FOUND' });
      });
    }).on('error', () => resolve({ b, meta: 'ERROR' }));
  });
}

async function run() {
  const r1 = await check('621-82-09482');
  console.log('r1:', r1);
  const r2 = await check('579-95-01063');
  console.log('r2:', r2);
}
run();
