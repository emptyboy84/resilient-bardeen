const https = require('https');

const url = 'https://bizno.net/article/1028111670';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Regex for table rows
    const regex = /<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi;
    let match;
    while ((match = regex.exec(data)) !== null) {
      const th = match[1].replace(/<[^>]+>/g, '').trim();
      const td = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      console.log(`${th} : ${td}`);
    }
  });
}).on('error', console.error);
