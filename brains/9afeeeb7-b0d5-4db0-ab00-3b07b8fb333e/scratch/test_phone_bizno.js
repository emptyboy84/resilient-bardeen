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
  const query = encodeURIComponent('01084722477');
  const html = await fetchUrl('https://bizno.net/?query=' + query);
  const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('Result for 01084722477:', clean.slice(0, 1000));
}

run().catch(console.error);
