const https = require('https');

function searchBiznoArea(area, q) {
  return new Promise((resolve) => {
    const url = `https://bizno.net/?area=${area}&query=${encodeURIComponent(q)}`;
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 6000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

function extractResults(html) {
  const regex = /<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const results = [];
  const seen = new Set();
  while ((match = regex.exec(html)) !== null) {
    const b = match[1];
    if (!seen.has(b)) {
      seen.add(b);
      const title = match[2].replace(/<[^>]+>/g, '').trim();
      results.push({ bizno: b, title });
    }
  }
  return results;
}

async function test() {
  console.log('Testing area=ceo for 정지후 (동그라미광고공사):');
  const d1 = await searchBiznoArea('ceo', '정지후');
  console.log('Results:', extractResults(d1));

  console.log('\nTesting area=ceo for 박명섭 (녹생광고연합그린하우징):');
  const d2 = await searchBiznoArea('ceo', '박명섭');
  console.log('Results:', extractResults(d2));

  console.log('\nTesting area=ceo for 김현 (블루호텔레코딩스튜디오):');
  const d3 = await searchBiznoArea('ceo', '김현');
  console.log('Results count:', extractResults(d3).length);

  console.log('\nTesting area=tel for 051-200-6281 (동아대학교출판부):');
  const d4 = await searchBiznoArea('tel', '051-200-6281');
  console.log('Results:', extractResults(d4));

  console.log('\nTesting area=tel for 051-464-0761 (동화사):');
  const d5 = await searchBiznoArea('tel', '051-464-0761');
  console.log('Results:', extractResults(d5));
  
  console.log('\nTesting area=tel for 051-313-3449 (단디콤):');
  const d6 = await searchBiznoArea('tel', '051-313-3449');
  console.log('Results:', extractResults(d6));
}

test();
