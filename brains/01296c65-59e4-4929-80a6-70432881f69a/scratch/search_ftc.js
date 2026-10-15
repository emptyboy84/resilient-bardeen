const https = require('https');

// Check Fair Trade Commission tele-sales business lookup
function searchFTC(corpNm) {
  return new Promise((resolve, reject) => {
    const postData = `searchKey=01&searchVal=${encodeURIComponent(corpNm)}`;
    const req = https.request('https://www.ftc.go.kr/www/bizCommList.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  try {
    const data = await searchFTC('스튜디오비오');
    console.log('FTC Response length:', data.length);
    const clean = data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (clean.includes('조회된 데이터가 없습니다') || clean.includes('검색결과가 없습니다')) {
      console.log('FTC: 조회된 데이터 없음');
    } else {
      console.log('FTC match:', clean.substring(clean.indexOf('검색결과'), clean.indexOf('검색결과') + 500));
    }
  } catch(e) {
    console.error(e);
  }
}

main();
