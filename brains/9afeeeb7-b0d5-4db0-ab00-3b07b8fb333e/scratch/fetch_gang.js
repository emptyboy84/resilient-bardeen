const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const query = encodeURIComponent('7738501012');
  const html = await fetchUrl('https://bizno.net/?query=' + query);
  const m = html.match(/href="(\/article\/[^"]+)"/);
  if (m) {
    console.log('Article link:', m[1]);
    const detailHtml = await fetchUrl('https://bizno.net' + m[1]);
    const clean = detailHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/\s+/g, ' ');
    console.log('Detail:', clean.slice(0, 1500));
  } else {
    console.log('No article found in bizno');
    const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log(clean.slice(0, 1000));
  }
}
run().catch(console.error);
