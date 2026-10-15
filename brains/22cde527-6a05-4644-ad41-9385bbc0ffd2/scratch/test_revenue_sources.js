const https = require('https');
const http = require('http');

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        ...headers
      }
    }, (res) => {
      let data = '';
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) {
          loc = new URL(loc, url).href;
        }
        return fetchUrl(loc, headers).then(resolve).catch(reject);
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function test() {
  console.log('Testing Saramin search for 브이드림...');
  try {
    const saraminUrl = `https://www.saramin.co.kr/zf_user/search/company?searchword=${encodeURIComponent('브이드림')}`;
    const res = await fetchUrl(saraminUrl);
    console.log('Saramin status:', res.status, 'len:', res.data.length);
    // Check if any company link or revenue is in the text
    const matches = res.data.match(/csn=([0-9]+)/g);
    console.log('CSN matches in Saramin:', matches ? matches.slice(0, 5) : 'none');
    // Check for 매출액 text
    const revMatches = res.data.match(/매출액[^<]+/g);
    console.log('Revenue text matches:', revMatches ? revMatches.slice(0, 5) : 'none');
  } catch(e) {
    console.log('Saramin error:', e.message);
  }

  console.log('\nTesting Jobkorea search for 브이드림...');
  try {
    const jkUrl = `https://www.jobkorea.co.kr/Search/?stext=${encodeURIComponent('브이드림')}&tabType=corp`;
    const res = await fetchUrl(jkUrl);
    console.log('Jobkorea status:', res.status, 'len:', res.data.length);
    const revMatches = res.data.match(/[0-9,]+(억|천만|백만|원)/g);
    console.log('Jobkorea revenue snippets:', res.data.includes('매출액') ? 'Found 매출액' : 'No 매출액');
  } catch(e) {
    console.log('Jobkorea error:', e.message);
  }
}

test();
