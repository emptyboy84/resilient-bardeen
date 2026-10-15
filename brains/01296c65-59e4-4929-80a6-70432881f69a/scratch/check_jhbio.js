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
  const b = '1058802863';
  const html = await getArticle(b);
  console.log('HTML length:', html.length);
  const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[\s\S]*?<\/style>/gi, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ');
  
  const pos = clean.indexOf('기본정보');
  if (pos !== -1) {
    console.log(clean.substring(pos, pos + 1500));
  } else {
    console.log(clean.substring(0, 1500));
  }
}

main();
