const https = require('https');
const fs = require('fs');

function searchNaver(query) {
  return new Promise((resolve, reject) => {
    const url = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(query)}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    };
    https.get(url, options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function check() {
  const html = await searchNaver('"스튜디오비오"');
  if (html.includes('검색결과가 없습니다') || html.includes('에 대한 검색결과가 없습니다')) {
    console.log('"스튜디오비오": 결과 없음');
  } else {
    console.log('"스튜디오비오": 결과 있음! 크기:', html.length);
    // save to inspect
    fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/01296c65-59e4-4929-80a6-70432881f69a/scratch/naver_res.html', html);
  }

  const html2 = await searchNaver('부산 "인디랩" "이한빈"');
  console.log('부산 인디랩 이한빈 결과 포함 여부:', !html2.includes('검색결과가 없습니다'));

  const html3 = await searchNaver('"이한빈" "010-5093-0304"');
  console.log('이한빈 전화번호 결과 포함 여부:', !html3.includes('검색결과가 없습니다'));
}

check();
