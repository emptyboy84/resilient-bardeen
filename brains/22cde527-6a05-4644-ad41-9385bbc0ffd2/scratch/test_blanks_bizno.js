const https = require('https');

function searchBizno(query, area = '부산') {
  return new Promise((resolve) => {
    const url = `https://bizno.net/?area=${encodeURIComponent(area)}&query=${encodeURIComponent(query)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        // extract article links
        const matches = d.match(/\/article\/[0-9]+/g) || [];
        resolve([...new Set(matches)]);
      });
    }).on('error', () => resolve([]));
  });
}

async function testSample() {
  const sampleNames = [
    '메타블루', '그리드파트너스', '시그마씨앤에스', '에스랩', '에코비티',
    '나원디앤씨', '도서출판일광', '동아대학교출판부', '동화사', '단디콤'
  ];

  for (const name of sampleNames) {
    const res = await searchBizno(name, '부산');
    console.log(`Query "${name}" (부산): found ${res.length} articles -> ${res.slice(0, 3).join(', ')}`);
    if (res.length === 0) {
      const resAll = await searchBizno(name, '');
      console.log(`  Retry without area: found ${resAll.length} articles -> ${resAll.slice(0, 3).join(', ')}`);
    }
  }
}

testSample();
