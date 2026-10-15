const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'Referer': 'https://www.saramin.co.kr/'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function inspectDetail() {
  const url = 'https://www.saramin.co.kr/zf_user/company-info/view?csn=ZjQvcWk4cUVOYW9KWnh3b1AxWUNNZz09';
  const html = await fetchUrl(url);
  console.log('Detail HTML length:', html.length);
  
  // Look for revenue, sales, financial statements
  const matches = html.match(/매출액[\s\S]{0,300}/g);
  console.log('Matches for 매출액:', matches ? matches.slice(0, 5) : 'none');

  // Also look for tables or financial summaries
  const years = html.match(/202[0-9]년/g);
  console.log('Year mentions:', [...new Set(years || [])]);

  // Let's write the relevant section or dump text
  const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const idx = clean.indexOf('매출액');
  if (idx !== -1) {
    console.log('Context around 매출액:');
    console.log(clean.substring(Math.max(0, idx - 100), idx + 300));
  }
}

inspectDetail();
