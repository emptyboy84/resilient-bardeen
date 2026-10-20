const http = require('http');

http.get('http://hsnpl.co.kr', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const regex = /href=["']([^"']+)["']/g;
    let match;
    const links = new Set();
    while ((match = regex.exec(data)) !== null) {
      if (!match[1].startsWith('#') && !match[1].startsWith('javascript')) {
        links.add(match[1]);
      }
    }
    console.log('Links on hsnpl:', Array.from(links));
  });
});
