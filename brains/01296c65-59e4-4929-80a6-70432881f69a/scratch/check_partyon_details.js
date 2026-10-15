const https = require('https');

function getArticle(bizno) {
  return new Promise((resolve, reject) => {
    const url = `https://bizno.net/article/${bizno}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const biznos = ['6591501917', '6553000767', '2541900098', '2110886109', '6171278013'];
  for (const b of biznos) {
    console.log(`\n=================== Bizno: ${b} ===================`);
    const html = await getArticle(b);
    const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ');
    const pos = clean.indexOf('기본정보');
    if (pos !== -1) {
      console.log(clean.substring(pos, pos + 800));
    } else {
      console.log(clean.substring(0, 500));
    }
  }
}

main();
