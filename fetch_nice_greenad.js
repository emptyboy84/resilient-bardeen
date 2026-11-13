const https = require('https');
const fs = require('fs');
const url = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEEjoT1rpqZqIBz0z1SmFLT4-x4N0GdobJchiFZ3KjVkNX7Lx8XL3iN408jO-DPcTSHxq1cCt8aSmWP2JXXApxUHXde5vbQKp_JQUa1KNcrIrSBNtQtcGisnXedXFyVGilVMJ_-zMPrNZs3JqVEB8Fq8bE=';

https.get(url, res => {
  console.log('Nice Loc:', res.headers.location);
  if (res.headers.location) {
    https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r2 => {
      let d = '';
      r2.on('data', c => d += c);
      r2.on('end', () => {
        fs.writeFileSync('nice_greenad.html', d);
        console.log('Saved nice_greenad len:', d.length);
        const phones = d.match(/010[- ]?\d{3,4}[- ]?\d{4}|051[- ]?\d{3,4}[- ]?\d{4}|070[- ]?\d{3,4}[- ]?\d{4}|02[- ]?\d{3,4}[- ]?\d{4}/g) || [];
        console.log('Phones in Nice:', [...new Set(phones)]);
        const tables = d.match(/<table[\s\S]*?<\/table>/gi) || [];
        tables.forEach((t, i) => {
          console.log(`Table ${i}:\n`, t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
        });
      });
    });
  }
});
