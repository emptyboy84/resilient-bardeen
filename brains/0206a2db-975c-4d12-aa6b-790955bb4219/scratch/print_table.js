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

async function main() {
  const html = await fetchUrl('https://bizno.net/article/8988802742');
  const idx = html.indexOf('table_guide01');
  if (idx !== -1) {
    const end = html.indexOf('</table>', idx);
    const tableHtml = html.substring(idx - 10, end + 8);
    console.log(tableHtml);
  } else {
    console.log('table_guide01 not found');
  }
}

main().catch(console.error);
