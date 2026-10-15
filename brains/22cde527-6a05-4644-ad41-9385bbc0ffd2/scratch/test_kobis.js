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
  console.log('CSRF Token:', token);

  const targets = ['브이알코리아', '소울필름', '쏘울픽처스', '케세라세라', '냉이영화'];
  for (const t of targets) {
    const res = await searchKobis(token, t);
    // Find rows
    const rows = res.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    console.log(`\n[KOBIS] Search "${t}" -> rows count: ${rows.length}`);
    rows.forEach(r => {
      if (r.includes('searchCompanyDtl.do')) {
        const clean = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('   Match:', clean);
      }
    });
  }
}

run();
