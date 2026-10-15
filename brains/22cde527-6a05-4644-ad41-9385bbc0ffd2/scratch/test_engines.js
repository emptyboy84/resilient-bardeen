const https = require('https');

function fetchUrl(url, headers = {}) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        ...headers
      },
      timeout: 8000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: d }));
    }).on('error', (e) => resolve({ status: 500, error: e.message }));
  });
}

function isValidBizNo(b) {
  if (!b) return false;
  const clean = b.replace(/[^0-9]/g, '');
  if (clean.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(clean[i]) * weights[i];
  const d9 = Number(clean[8]) * 5;
  sum += Math.floor(d9 / 10) + (d9 % 10);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(clean[9]);
}

async function testDaum(term) {
  const url = `https://search.daum.net/search?w=tot&q=${encodeURIComponent(term)}`;
  const res = await fetchUrl(url);
  const matches = (res.data || '').match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
  const valid = [...new Set(matches.filter(isValidBizNo))];
  console.log(`[Daum] "${term}" -> valid biznos:`, valid);
  if (valid.length > 0) {
    const snips = (res.data || '').match(new RegExp(`.{0,40}(?:${valid[0]}).{0,60}`, 'g')) || [];
    console.log(`[Daum] Snippet:`, snips.slice(0, 2));
  }
}

async function testNaver(term) {
  const url = `https://search.naver.com/search.naver?where=nexearch&query=${encodeURIComponent(term)}`;
  const res = await fetchUrl(url);
  const matches = (res.data || '').match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
  const valid = [...new Set(matches.filter(isValidBizNo))];
  console.log(`[Naver] "${term}" -> valid biznos:`, valid);
  if (valid.length > 0) {
    const snips = (res.data || '').match(new RegExp(`.{0,40}(?:${valid[0]}).{0,60}`, 'g')) || [];
    console.log(`[Naver] Snippet:`, snips.slice(0, 2));
  }
}

async function run() {
  console.log('Testing engines on "동아대학교출판사"...');
  await testNaver('"동아대학교출판사" 사업자');
  await testDaum('"동아대학교출판사" 사업자');
  
  console.log('\nTesting engines on Row 611 "동화사"...');
  await testNaver('"동화사" "초량동" 사업자등록번호');
  await testDaum('"동화사" "초량동" 사업자');
}

run();
