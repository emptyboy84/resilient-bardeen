const https = require('https');

async function searchNaverPlace() {
  const q = encodeURIComponent('센텀위너스부동산공인중개사사무소');
  const url = `https://map.naver.com/p/api/search/allSearch?query=${q}&type=all&searchCoord=129.1245;35.1751`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();
  console.log('Naver map API status:', res.status, 'Len:', text.length);
  try {
    const json = JSON.parse(text);
    console.log('Results:', JSON.stringify(json.result?.place?.list || json.result || json, null, 2).slice(0, 1500));
  } catch (e) {
    console.log('Snippet:', text.slice(0, 500));
  }
}

searchNaverPlace();
