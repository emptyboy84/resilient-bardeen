const https = require('https');

function getUrl(url) {
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

async function checkDetails() {
  console.log('Checking https://bizno.net/article/2010148623 ...');
  const html = await getUrl('https://bizno.net/article/2010148623');
  const lines = html.split('\n');
  lines.forEach(l => {
    const t = l.replace(/<[^>]+>/g, '').trim();
    if (t.includes('회사명') || t.includes('대표자') || t.includes('주소') || t.includes('업종') || t.includes('사업자등록번호') || t.includes('상태') || t.includes('전화')) {
      console.log('  ', t);
    }
  });
}

checkDetails();
