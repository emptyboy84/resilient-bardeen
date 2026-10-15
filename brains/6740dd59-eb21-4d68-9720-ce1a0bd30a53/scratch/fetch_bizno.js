const https = require('https');

const url = 'https://bizno.net/?query=' + encodeURIComponent('교보문고');

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Regex for articles
    const regex = /<a\s+href="(\/article\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = regex.exec(data)) !== null) {
      const link = match[1];
      const text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      console.log(link, ':', text);
    }
  });
}).on('error', (err) => console.error(err));
