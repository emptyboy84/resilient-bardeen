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
  console.log('Length:', html.length);
  const lines = html.split('\n');
  lines.forEach(l => {
    const t = l.trim();
    if (t.includes('명') || t.includes('인원') || t.includes('사원') || t.includes('국민연금') || t.includes('입사') || t.includes('퇴사')) {
      console.log('Line:', t);
    }
  });
}

main().catch(console.error);
