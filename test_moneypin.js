const https = require('https');

async function testMoneypin(brno) {
  return new Promise(resolve => {
    https.get(`https://moneypin.biz/bizno/${brno}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      console.log(`Moneypin ${brno} status:`, res.statusCode);
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log('Len:', d.length);
        const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        console.log('Snippet:\n', text.substring(0, 500));
        resolve();
      });
    }).on('error', e => {
      console.log('Err:', e.message);
      resolve();
    });
  });
}

testMoneypin('5039527260'); // Row 1181 자연앤과학
