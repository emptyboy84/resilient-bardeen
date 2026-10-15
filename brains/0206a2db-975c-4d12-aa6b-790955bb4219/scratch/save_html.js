const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
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
  const articleHtml = await fetchUrl('https://bizno.net/article/8985800242');
  fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\0206a2db-975c-4d12-aa6b-790955bb4219\\scratch\\article_8985800242.html', articleHtml, 'utf8');

  const queryHtml = await fetchUrl('https://bizno.net/?query=8985800242');
  fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\0206a2db-975c-4d12-aa6b-790955bb4219\\scratch\\query_8985800242.html', queryHtml, 'utf8');

  console.log('Saved both files.');
}

run().catch(console.error);
