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
  const query = encodeURIComponent('7792800250');
  const html = await fetchUrl('https://bizno.net/?query=' + query);
  const rows = html.split('<tr');
  console.log('Rows count:', rows.length);
  for (const r of rows) {
    if (r.includes('7792800250') || r.includes('대진정공') || r.includes('김명재')) {
      console.log('Match:', r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    }
  }
}
run().catch(console.error);
