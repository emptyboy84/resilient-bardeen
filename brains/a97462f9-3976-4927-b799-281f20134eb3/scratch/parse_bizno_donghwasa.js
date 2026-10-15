const https = require('https');

function searchBizno(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://bizno.net/?query=' + encodeURIComponent(query);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
}

async function run() {
  const html = await searchBizno('동화사');
  // Look for items. Usually bizno uses <div class="titles"> or <a href="/article/...">
  const itemRegex = /<a href="(\/article\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let match;
  const items = [];
  while ((match = itemRegex.exec(html)) !== null) {
    const link = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (text) {
      items.push({ link, text });
    }
  }
  console.log(`Found ${items.length} links.`);
  items.forEach(it => {
    if (it.text.includes('동화사') || it.text.includes('동화')) {
      console.log(`${it.text} -> https://bizno.net${it.link}`);
    }
  });
}

run();
