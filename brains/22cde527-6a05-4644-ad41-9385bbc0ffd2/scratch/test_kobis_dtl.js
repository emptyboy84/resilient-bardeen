const https = require('https');

function testUrl(url) {
  return new Promise(resolve => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(`[${url}] Status: ${res.statusCode}, Length: ${d.length}`);
        if (d.length > 500) {
          const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
          console.log('Snippet:', text.slice(0, 400));
        }
        resolve();
      });
    }).on('error', () => resolve());
  });
}

async function run() {
  await testUrl('https://www.kobis.or.kr/kobis/business/mast/comp/searchCompanyDtl.do?companyCd=20125855');
  await testUrl('https://www.kobis.or.kr/kobis/business/mast/comp/findCompanyInfo.do?companyCd=20125855');
}

run();
