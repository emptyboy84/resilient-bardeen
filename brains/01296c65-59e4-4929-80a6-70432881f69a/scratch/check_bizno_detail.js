const https = require('https');

function getArticle(bizno) {
  return new Promise((resolve, reject) => {
    const url = `https://bizno.net/article/${bizno}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
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
  const list = ['5553700471', '4996900527'];
  for (const b of list) {
    console.log(`=== Bizno: ${b} ===`);
    const html = await getArticle(b);
    // extract table or key info
    const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ');
    // find relevant keywords: 대표자, 주소, 상호
    console.log(clean.substring(clean.indexOf('기본정보'), clean.indexOf('기본정보') + 800));
  }
}

main();
