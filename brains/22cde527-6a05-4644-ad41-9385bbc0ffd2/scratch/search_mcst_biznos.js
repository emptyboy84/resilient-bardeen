const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      },
      timeout: 8000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
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

async function search(queries) {
  for (const q of queries) {
    const url = `https://search.naver.com/search.naver?where=nexearch&query=${encodeURIComponent(q)}`;
    const html = await fetchUrl(url);
    const matches = html.match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
    const valid = [...new Set(matches.filter(isValidBizNo))];
    if (valid.length > 0) {
      console.log(`Query [${q}] matched:`, valid);
      for (const v of valid) {
        const snips = html.match(new RegExp(`.{0,40}(?:${v}).{0,60}`, 'g')) || [];
        console.log(`   Snippet:`, snips[0]);
      }
    }
    await new Promise(r => setTimeout(r, 200));
  }
}

async function run() {
  console.log('=== Searching for 샐리북 (임은선, 연제구) ===');
  await search([
    '"샐리북" "임은선"',
    '"샐리북" 연제구 사업자',
    '"샐리북" 사업자등록번호',
    '샐리북 출판사 사업자등록번호'
  ]);

  console.log('\n=== Searching for 꼬꼬야 (수영구) ===');
  await search([
    '"꼬꼬야" 출판사 수영구',
    '"꼬꼬야" "251002021000019"',
    '"꼬꼬야" 출판사 사업자등록번호'
  ]);

  console.log('\n=== Searching for 나래바람 (051-612-2133, 남구 용호동 LG메트로시티) ===');
  await search([
    '"나래바람" "051-612-2133"',
    '"나래바람" "LG메트로시티"',
    '"나래바람" 출판사 사업자',
    '"051-612-2133" 사업자등록번호'
  ]);

  console.log('\n=== Searching for 도서출판 일광 (051-723-0037, 기장군 차성로344번길) ===');
  await search([
    '"도서출판 일광" "기장"',
    '"051-723-0037"',
    '"일광출판사" "기장" 사업자'
  ]);

  console.log('\n=== Searching for 비전조이 (이구창, 해운대구) ===');
  await search([
    '"비전조이" "이구창"',
    '"비전조이" 해운대구'
  ]);

  console.log('\n=== Searching for 양업서원 (민병선, 부산진구) ===');
  await search([
    '"양업서원" "민병선"',
    '"양업서원" 부산진구'
  ]);
}

run();
