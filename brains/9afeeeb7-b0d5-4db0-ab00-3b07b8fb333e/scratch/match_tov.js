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
  const query = encodeURIComponent('8971701395');
  const html = await fetchUrl('https://bizno.net/?query=' + query);
  const rows = html.split('<tr');
  for (const r of rows) {
    if (r.includes('8971701395') || r.includes('토브') || r.includes('정재영')) {
      console.log('Match:', r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    }
  }
}
run().catch(console.error);
