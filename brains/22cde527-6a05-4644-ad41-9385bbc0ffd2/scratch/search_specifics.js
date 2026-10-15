const https = require('https');

function search(q) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/?query=' + encodeURIComponent(q), { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const targets = ['메쉬링크', '동아대학교출판', '인우랩', '하늘연', '에스랩', '아크리아스튜디오', '더천유'];
  for (const t of targets) {
    const html = await search(t);
    const m = html.match(/<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>/gi) || [];
    console.log(`=== ${t} ===`);
    m.slice(0, 3).forEach(x => {
      const b = x.match(/\/article\/(\d{10})/)[1];
      const title = x.replace(/<[^>]+>/g, '').trim();
      console.log(`  Bizno: ${b} | Title: ${title}`);
    });
  }
}
run();
