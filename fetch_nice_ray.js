const https = require('https');
const qs = require('querystring');
const fs = require('fs');

const postData = qs.stringify({
  search_word: '레이시스템'
});

const req = https.request('https://www.nicebizinfo.com/ep/EP0100M001GE.nice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    fs.writeFileSync('nice_search_ray.html', d);
    console.log('Saved len:', d.length);
    console.log('Includes 신기철:', d.includes('신기철'));
    console.log('Includes 121:', d.includes('121-28') || d.includes('12128'));
    const kiscodes = d.match(/kiscode=([A-Z0-9]+)/gi) || [];
    console.log('Kiscodes:', [...new Set(kiscodes)]);
  });
});

req.write(postData);
req.end();
