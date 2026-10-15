const https = require('https');

async function inspect(b, label) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/article/' + b.replace(/-/g, ''), { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const m = d.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        console.log(`=== ${label} (${b}) ===`);
        console.log('Meta:', m ? m[1] : 'NONE');
        resolve();
      });
    }).on('error', () => resolve());
  });
}

async function run() {
  await inspect('605-26-59816', '드림유엔터테인먼트');
  await inspect('620-13-76639', '도성회');
  await inspect('607-20-42298', '89Light');
  await inspect('595-94-01807', '꿈해몽');
}
run();
