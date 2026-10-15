const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
  });
}

async function test() {
  // Test 브이드림
  const html1 = await fetchUrl('https://www.saramin.co.kr/zf_user/company-info/view?csn=ZjQvcWk4cUVOYW9KWnh3b1AxWUNNZz09');
  // Test 피커스튜디오
  const html2 = await fetchUrl('https://www.saramin.co.kr/zf_user/company-info/view?csn=N3FJclNyUlVnRTVjK1NNNlh3cHREQT09');

  function extractItems(html, label) {
    console.log(`\n--- ${label} ---`);
    const liList = html.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];
    for (let li of liList) {
      if (li.includes('company_summary_desc')) {
        const tit = (li.match(/<strong class="company_summary_tit">\s*([^<]+)\s*<\/strong>/) || [])[1];
        const desc = (li.match(/<p class="company_summary_desc">\s*([^<]+)\s*<\/p>/) || [])[1];
        if (tit && desc) {
          console.log(`  [${desc.trim()}]: ${tit.trim()}`);
        }
      }
    }
  }

  extractItems(html1, '브이드림');
  extractItems(html2, '피커스튜디오');
}

test();
