const https = require('https');

https.get('https://bizno.net/article/1248802170', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
}, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const meta = d.match(/<meta[^>]*content="[^"]*사업자 현재 상태[^"]*"/i);
    console.log('Meta tag:', meta ? meta[0] : 'not found');
    
    // Also let's inspect the table body for 사업자 현재 상태
    const tablePart = d.match(/사업자 현재 상태[\s\S]{1,500}/i);
    console.log('Table part:\n', tablePart ? tablePart[0].slice(0, 300) : 'not found');
  });
});
