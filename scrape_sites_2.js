const https = require('https');

async function scrapeSites() {
  // 1. 웰메틱스아이앤씨 (https://mindzchain.com/)
  https.get('https://mindzchain.com/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      const phones = d.match(/010[- ]?\d{3,4}[- ]?\d{4}|051[- ]?\d{3,4}[- ]?\d{4}|070[- ]?\d{3,4}[- ]?\d{4}|1[568][0-9]{2}[- ]?[0-9]{4}/g) || [];
      console.log('[1078 웰메틱스아이앤씨 mindzchain.com] Phones:', [...new Set(phones)]);
      const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      console.log('Snippet:\n', text.substring(0, 500));
    });
  }).on('error', e => console.log('1078 Err:', e.message));

  // 2. 위클리벤처스 (https://soulcanvas.art)
  https.get('https://soulcanvas.art', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      const phones = d.match(/010[- ]?\d{3,4}[- ]?\d{4}|051[- ]?\d{3,4}[- ]?\d{4}|070[- ]?\d{3,4}[- ]?\d{4}|1[568][0-9]{2}[- ]?[0-9]{4}/g) || [];
      console.log('[1155 위클리벤처스 soulcanvas.art] Phones:', [...new Set(phones)]);
      const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      console.log('Snippet:\n', text.substring(0, 500));
    });
  }).on('error', e => console.log('1155 Err:', e.message));
}
scrapeSites();
