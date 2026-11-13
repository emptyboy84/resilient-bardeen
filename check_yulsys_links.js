const https = require('https');

https.get('https://yulsys.com', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const links = d.match(/href="([^"]+)"/gi) || [];
    console.log('Links:\n', [...new Set(links)]);
    
    // search for any numbers
    const phones = d.match(/0\d{1,2}-\d{3,4}-\d{4}/g);
    console.log('Phones in raw html:', phones);
  });
});
