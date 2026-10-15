const https = require('https');

https.get('https://www.nicebizinfo.com/ep/EP0100M002GE.nice?kiscode=IW6627', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const bMatch = d.match(/\d{3}-\d{2}-\d{5}/g);
    console.log('Biznos:', bMatch);
    const m = d.match(/사업자[등록]*번호[\s\S]{0,100}/i);
    console.log('Match:', m ? m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'NONE');
  });
});
