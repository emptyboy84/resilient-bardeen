const https = require('https');

async function search(q) {
  return new Promise((resolve) => {
    const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const queries = [
    '한국테크 창원 팔용로',
    '한국테크 609-09-45485',
    '한국테크 김대선 창원',
    '창원 한국테크 마산회원구'
  ];
  for (const q of queries) {
    console.log('=== Query:', q);
    const html = await search(q);
    const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const re = /.{0,60}한국테크.{0,60}/g;
    let m;
    let count = 0;
    while ((m = re.exec(clean)) !== null && count < 5) {
      console.log(' -', m[0].trim());
      count++;
    }
  }
}
run();
