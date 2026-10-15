const https = require('https');

function searchNaver(query) {
  return new Promise((resolve, reject) => {
    const url = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(query)}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    };
    https.get(url, options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function searchDaum(query) {
  return new Promise((resolve, reject) => {
    const url = `https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&sq=&o=&q=${encodeURIComponent(query)}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    };
    https.get(url, options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const queries = [
    '스튜디오비오',
    '스튜디오비오 이한빈',
    '스튜디오비오 게임',
    '스튜디오비오 해운대구',
    '이한빈 010-5093-0304'
  ];

  for (const q of queries) {
    console.log(`\n=================== NAVER: ${q} ===================`);
    const nHtml = await searchNaver(q);
    // extract snippets
    const cleanN = nHtml.replace(/<script[\s\S]*?<\/script>/gi, '')
                        .replace(/<style[\s\S]*?<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ');
    // print matches containing 스튜디오 or 이한빈
    const idx = cleanN.indexOf(q.split(' ')[0]);
    if (idx !== -1) {
      console.log('Snippet:', cleanN.substring(idx - 100, idx + 300));
    } else {
      console.log('No direct snippet found.');
    }
  }
}

main();
