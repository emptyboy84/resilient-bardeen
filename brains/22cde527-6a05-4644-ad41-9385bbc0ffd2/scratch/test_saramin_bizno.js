const https = require('https');

function searchSaramin(query) {
  return new Promise((resolve, reject) => {
    const url = `https://www.saramin.co.kr/zf_user/search/company?searchword=${encodeURIComponent(query)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function test() {
  console.log('Testing bizno query: 186-86-00972');
  const d1 = await searchSaramin('186-86-00972');
  console.log('Result 1 length:', d1.length, 'includes 브이드림:', d1.includes('브이드림'));

  console.log('\nTesting bizno query without hyphen: 1868600972');
  const d2 = await searchSaramin('1868600972');
  console.log('Result 2 length:', d2.length, 'includes 브이드림:', d2.includes('브이드림'));
}

test();
