const https = require('https');

function searchBizno(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/?query=' + encodeURIComponent(query);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function getBiznoArticle(bno) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/article/' + bno;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const html = await searchBizno('이석창');
  const regex = /<a\s+href="\/article\/(\d+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;
  const articles = [];
  while ((match = regex.exec(html)) !== null) {
    articles.push({ bno: match[1], title: match[2].replace(/<[^>]+>/g, '').trim() });
  }
  console.log(`Found ${articles.length} articles.`);

  for (const art of articles.slice(0, 20)) {
    const pageHtml = await getBiznoArticle(art.bno);
    if (pageHtml.includes('이석창')) {
      console.log(`\n[MATCH] ${art.title} (${art.bno})`);
      const lines = pageHtml.split('\n');
      lines.forEach(l => {
        const t = l.replace(/<[^>]+>/g, '').trim();
        if (t.includes('대표자명') || t.includes('회사주소') || t.includes('업종') || t.includes('상태') || t.includes('전화')) {
          console.log('  ', t);
        }
      });
    }
  }
}

run();
