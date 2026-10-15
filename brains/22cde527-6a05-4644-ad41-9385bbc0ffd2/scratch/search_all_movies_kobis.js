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
  const html = await getKobisSearchPage();
  const mCsrf = html.match(/name="CSRFToken"\s+value="([^"]+)"/);
  const token = mCsrf ? mCsrf[1] : '';

  const movies = [
    { row: 547, name: '냉이영화' },
    { row: 725, name: '박기양' },
    { row: 757, name: '브이알코리아' },
    { row: 817, name: '소울필름' },
    { row: 1162, name: '촬영감독최원욱' },
    { row: 1418, name: '쏘울픽처스' },
    { row: 1483, name: '케세라세라' },
    { row: 2120, name: '인생극장' },
    { row: 2122, name: '플랫폼' }
  ];

  for (const m of movies) {
    const res = await searchKobis(token, m.name);
    const rows = res.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    console.log(`\nRow ${m.row}: [${m.name}] -> found ${rows.length - 1} rows`);
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const text = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const mCode = r.match(/mstView\('company','(\d+)'\)/);
      const code = mCode ? mCode[1] : '';
      console.log(`   [${code}] ${text}`);
      if (text.includes('부산')) {
        const dtl = await fetchDtl(code);
        console.log('   DETAIL:', dtl.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300));
      }
    }
  }
}

run();
