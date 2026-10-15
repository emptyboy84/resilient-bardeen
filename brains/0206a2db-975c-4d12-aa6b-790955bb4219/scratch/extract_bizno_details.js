const https = require('https');

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
  
  // extract all table rows from table_guide01
  const rows = html.match(/<tr><th>(.*?)<\/th><td>(.*?)<\/td><\/tr>/g) || [];
  console.log('--- Bizno Details ---');
  rows.forEach(r => {
    const cleaned = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(cleaned);
  });
}

main().catch(console.error);
