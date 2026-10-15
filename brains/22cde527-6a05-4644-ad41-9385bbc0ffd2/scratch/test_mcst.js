const https = require('https');

function searchMcst(name) {
  return new Promise((resolve) => {
    // Naver search with site:book.mcst.go.kr
    const q = `site:book.mcst.go.kr "${name}" 부산`;
    const url = `https://search.naver.com/search.naver?where=nexearch&query=${encodeURIComponent(q)}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function test() {
  const pubSample = ['도서출판일광', '도서출판국제', '도성회', '동화사', '백앤센스'];
  for (const p of pubSample) {
    const html = await searchMcst(p);
    const m = html.match(/book\.mcst\.go\.kr[^\s"']+/g);
    console.log(`=== ${p} ===`);
    console.log('MCST Links:', m);
    // snippet
    const snip = html.match(/.{0,50}(?:신고|등록|폐업|영업|부산).{0,50}/g);
    console.log('Snippet:', snip?.slice(0, 2));
  }
}

test();
