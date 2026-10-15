const https = require('https');

https.get('https://bizno.net/article/2541900098', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let m;
    while ((m = tableRegex.exec(d)) !== null) {
      console.log('--- TABLE ---');
      console.log(m[1].replace(/<tr[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').trim());
    }
  });
});
