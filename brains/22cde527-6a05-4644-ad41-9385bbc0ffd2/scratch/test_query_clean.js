const https = require('https');

function searchSaramin(query) {
  return new Promise((resolve) => {
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
      res.on('end', () => resolve({ len: d.length, items: (d.split('class="item_corp"').length - 1) }));
    });
  });
}

async function test() {
  console.log('Search "주식회사 브이드림":', await searchSaramin('주식회사 브이드림'));
  console.log('Search "브이드림":', await searchSaramin('브이드림'));
  console.log('Search "초록이웃":', await searchSaramin('초록이웃'));
}

test();
