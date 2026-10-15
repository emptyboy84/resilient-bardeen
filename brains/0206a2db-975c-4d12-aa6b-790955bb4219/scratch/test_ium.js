const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function main() {
  const q = encodeURIComponent('투투');
  const res = await fetchUrl(`https://i-um.co.kr/search?keyword=${q}`);
  console.log('Status:', res.status);
  console.log('Body snippet:', res.body.substring(0, 500));
}

main().catch(console.error);
