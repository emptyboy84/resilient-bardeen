const https = require('https');

function fetchDtl(code) {
  return new Promise(resolve => {
    const postData = new URLSearchParams({
      code: code,
      sType: '',
      titleYN: 'Y',
      etcParam: '',
      isOuterReq: 'false'
    }).toString();

    const req = https.request('https://www.kobis.or.kr/kobis/business/mast/comp/searchCompanyDtl.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Length': Buffer.byteLength(postData),
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });

    req.on('error', () => resolve(''));
    req.write(postData);
    req.end();
  });
}

async function run() {
  const d = await fetchDtl('20125855');
  console.log('Detail response length:', d.length);
  // Strip tags and print
  const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('Clean text:\n', text.slice(0, 1000));
}

run();
