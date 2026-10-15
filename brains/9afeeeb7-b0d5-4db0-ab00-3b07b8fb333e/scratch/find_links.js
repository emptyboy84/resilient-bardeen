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
  const regex = /<a[^>]+href="(\/article\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (text) {
      console.log(match[1] + ' : ' + text);
    }
  }
}
run().catch(console.error);
