const https = require('https');
const fs = require('fs');

function searchDaum(query) {
  return new Promise((resolve, reject) => {
    const url = `https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&sq=&o=&q=${encodeURIComponent(query)}`;
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

async function main() {
  const queries = [
    '수영강변대로 140 "인디랩"',
    '"이한빈" "인디랩"',
    '"스튜디오비오"',
    '"이한빈" "부산" "게임"',
    '부산정보산업진흥원 "인디랩" "이한빈"'
  ];

  for (const q of queries) {
    console.log(`\n=================== DAUM: ${q} ===================`);
    const html = await searchDaum(q);
    const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ');
    
    // search for key tokens in clean
    const tokens = q.replace(/"/g, '').split(' ');
    let pos = -1;
    for (const t of tokens) {
      const p = clean.indexOf(t);
      if (p !== -1 && (pos === -1 || p < pos)) {
        pos = p;
      }
    }
    if (pos !== -1) {
      console.log(clean.substring(pos, pos + 400));
    } else {
      console.log('No matches found in text.');
    }
  }
}

main();
