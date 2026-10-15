const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', e => resolve(''));
  });
}

async function test() {
  const searchHtml = await fetchUrl('https://www.jobkorea.co.kr/Search/?stext=' + encodeURIComponent('브이드림') + '&tabType=corp');
  console.log('Search len:', searchHtml.length);
  // Look for company links in jobkorea
  const links = searchHtml.match(/\/Company\/[0-9]+/g) || [];
  console.log('Company links in Jobkorea:', [...new Set(links)]);
  if (links.length > 0) {
    const detailUrl = 'https://www.jobkorea.co.kr' + links[0];
    const detailHtml = await fetchUrl(detailUrl);
    console.log('Detail len:', detailHtml.length);
    const clean = detailHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const idx = clean.indexOf('매출액');
    if (idx !== -1) {
      console.log('Jobkorea revenue snippet:', clean.substring(Math.max(0, idx - 50), idx + 200));
    }
  }
}

test();
