const https = require('https');

function searchDaum(query) {
  return new Promise((resolve) => {
    const url = `https://search.daum.net/search?w=tot&q=${encodeURIComponent(query)}`;
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
    }).on('error', e => resolve(''));
  });
}

async function test() {
  const d1 = await searchDaum('186-86-00972 매출액');
  console.log('Query 1 len:', d1.length);
  const clean1 = d1.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const idx1 = clean1.indexOf('매출액');
  if (idx1 !== -1) {
    console.log('Snippet 1:', clean1.substring(Math.max(0, idx1 - 30), idx1 + 100));
  } else {
    console.log('Snippet 1: No 매출액');
  }

  const d2 = await searchDaum('브이드림 김민지 매출액');
  console.log('Query 2 len:', d2.length);
  const clean2 = d2.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const idx2 = clean2.indexOf('매출액');
  if (idx2 !== -1) {
    console.log('Snippet 2:', clean2.substring(Math.max(0, idx2 - 30), idx2 + 100));
  } else {
    console.log('Snippet 2: No 매출액');
  }
}

test();
