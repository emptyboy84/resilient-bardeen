const https = require('https');
const http = require('http');
const fs = require('fs');

const html = fs.readFileSync('daum_dk.html', 'utf8');

// look for place markers JSON
const m = html.match(/\"markers\":(\[[\s\S]*?\])/);
if (m) {
  console.log('Markers:', m[1]);
}

const placeMatch = html.match(/https?:\/\/(?:place\.map\.kakao\.com|map\.kakao\.com)\/[^\s\"\'<>]+/g);
console.log('Kakao map place links:', [...new Set(placeMatch || [])]);

// Fetch weseb
https.get('https://weseb.com/SJB/m.php?board=facto&command=body&no=40725', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Weseb length:', data.length);
    fs.writeFileSync('weseb_dk.html', data, 'utf8');
    const text = data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('Weseb text:', text.slice(0, 1000));
    const phones = data.match(/(?:051|02|070|031|01[016789])-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones in Weseb:', [...new Set(phones || [])]);
  });
}).on('error', err => console.error('Weseb error:', err.message));
