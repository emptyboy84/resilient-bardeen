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
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const url = 'https://allthatcompany.com/c/1650534/%EC%BC%80%EC%9D%B4%EC%95%88%EC%A0%84%EA%B8%B0%EC%88%A0%EC%9B%90';
  const html = await fetchUrl(url);
  const idx = html.indexOf('Month');
  if (idx !== -1) {
    console.log(html.substring(idx - 100, idx + 1000));
  }
}

main().catch(console.error);
