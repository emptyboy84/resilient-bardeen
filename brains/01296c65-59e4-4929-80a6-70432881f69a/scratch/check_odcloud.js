const https = require('https');

function getUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function main() {
  const blogUrl = 'https://sun-iron.tistory.com/entry/%EA%B5%AD%EC%84%B8%EC%B2%AD-%ED%99%88%ED%83%9D%EC%8A%A4-%EC%82%AC%EC%97%85%EC%9E%90%EB%93%B1%EB%A1%9D%EC%83%81%ED%83%9C%EC%A1%B0%ED%9A%8C-API-%ED%99%9C%EC%9A%A9';
  // Let's search DDG or web for the code
  const code = await getUrl('https://api.odcloud.kr/api/nts-businessman/v1/status');
  console.log('ODCloud response:', code);
}

main();
