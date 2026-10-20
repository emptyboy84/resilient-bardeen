const https = require('https');

https.get('https://place.map.kakao.com/1079108826', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Length:', data.length);
    const phones = data.match(/(?:051|02|070|031|01[016789])-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones in place page:', [...new Set(phones || [])]);
    const text = data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('Text snippet:', text.slice(0, 800));
  });
});
