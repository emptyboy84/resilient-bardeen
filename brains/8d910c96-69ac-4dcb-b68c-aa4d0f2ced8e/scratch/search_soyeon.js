const https = require('https');

function searchBizno(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/?header=search&query=' + encodeURIComponent(query);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', err => reject(err));
    });
  });
}

function getArticle(bno) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/article/' + bno;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', err => reject(err));
    });
  });
}

async function run() {
  const html = await searchBizno('이수연');
  const regex = /href="\/article\/([0-9]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;
  const items = [];
  while ((match = regex.exec(html)) !== null) {
    items.push({ bno: match[1], name: match[2].replace(/<[^>]+>/g, '').trim() });
  }
  console.log('Total found for 이수연:', items.length);
  for (const item of items) {
    const art = await getArticle(item.bno);
    const clean = art.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (clean.includes('최유창') || clean.includes('부산') || clean.includes('만화') || clean.includes('웹툰') || clean.includes('출판') || clean.includes('창작')) {
      console.log('MATCH:', item.bno, item.name);
      const m = clean.match(/사업자등록번호[\s\S]{1,400}/);
      if (m) console.log(m[0]);
    }
  }
}

run();
