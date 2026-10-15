const https = require('https');

function getKobisSearchPage() {
  return new Promise(resolve => {
    https.get('https://www.kobis.or.kr/kobis/business/mast/comp/searchCompanyList.do', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

function searchKobis(csrfToken, compName) {
  return new Promise(resolve => {
    const postData = new URLSearchParams({
      CSRFToken: csrfToken,
      curPage: '1',
      sCompanyNm: compName,
      sCompanyPartCd: '',
      sCompanyLang: '',
      sCompanyAreaCd: ''
    }).toString();

    const req = https.request('https://www.kobis.or.kr/kobis/business/mast/comp/searchCompanyList.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
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
  const html = await getKobisSearchPage();
  const mCsrf = html.match(/name="CSRFToken"\s+value="([^"]+)"/);
  const token = mCsrf ? mCsrf[1] : '';

  const res = await searchKobis(token, '브이알코리아');
  const rows = res.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  console.log('Row 2 raw HTML:\n', rows[2]);
}

run();
