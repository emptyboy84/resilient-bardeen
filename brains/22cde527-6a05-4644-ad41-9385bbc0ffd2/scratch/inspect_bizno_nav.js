const https = require('https');

https.get('https://bizno.net', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const links = d.match(/<a[^>]+href=["'][^"']+["'][^>]*>[\s\S]*?<\/a>/gi) || [];
    const searchLinks = links.filter(l => l.includes('조회'));
    console.log('Search links:');
    searchLinks.forEach(l => console.log(l.replace(/\s+/g, ' ')));
  });
});
