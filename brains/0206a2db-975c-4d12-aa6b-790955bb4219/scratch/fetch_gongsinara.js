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
  const res = await fetchUrl('https://gongsinara.com/company/2382118');
  console.log('Status:', res.status);
  const lines = res.body.split('\n');
  lines.forEach(l => {
    const t = l.trim();
    if (t.includes('종업원') || t.includes('사원') || t.includes('인원') || t.includes('대표') || t.includes('설립') || t.includes('사업자') || t.includes('법인') || t.includes('7') || t.includes('23')) {
      console.log('Line:', t);
    }
  });
}

main().catch(console.error);
