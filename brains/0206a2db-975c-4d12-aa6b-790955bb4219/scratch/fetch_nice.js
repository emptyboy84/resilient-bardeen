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
  const url = 'https://www.nicebizinfo.com/ep/EP01017482.nice?bno=8988802742';
  const res = await fetchUrl(url);
  console.log('Status:', res.status);
  console.log('Length:', res.body.length);
  
  // let's print lines with important keywords
  const lines = res.body.split('\n');
  lines.forEach(l => {
    const trimmed = l.trim();
    if (trimmed.includes('종업원') || trimmed.includes('사원') || trimmed.includes('인원') || trimmed.includes('대표') || trimmed.includes('매출') || trimmed.includes('설립') || trimmed.includes('업종')) {
      console.log('NICE:', trimmed);
    }
  });
}

main().catch(console.error);
