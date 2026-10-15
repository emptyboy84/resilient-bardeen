const https = require('https');
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const query = encodeURIComponent('강봉천흡선');
  const html = await fetchUrl('https://bizno.net/?query=' + query);
  const rows = html.split('<tr');
  for (const r of rows) {
    if (r.includes('강봉천흡선')) {
      console.log('--- Row ---');
      console.log(r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
      const m = r.match(/href="(\/article\/[^"]+)"/);
      if (m) {
        console.log('HREF:', m[1]);
        const dHtml = await fetchUrl('https://bizno.net' + m[1]);
        const clean = dHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                           .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                           .replace(/<[^>]+>/g, ' ')
                           .replace(/\s+/g, ' ');
        // print details like 법인등록번호, 사업자등록번호, 업종
        console.log('Detail snippet:', clean.slice(0, 1000));
      }
    }
  }
}
run().catch(console.error);
