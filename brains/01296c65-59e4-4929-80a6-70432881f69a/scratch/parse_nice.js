const https = require('https');
const fs = require('fs');

function searchNice(query) {
  return new Promise((resolve, reject) => {
    const url = `https://www.nicebizinfo.com/ep/EP0100M001GE.nice?searchWord=${encodeURIComponent(query)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await searchNice('스튜디오비오');
  // find list items or table rows
  const regex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length > 5) {
      console.log(`[Row ${count++}]`, text);
    }
  }
  if (count === 0) {
    console.log('No table rows found.');
    // search for any text containing 비오
    const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    let idx = 0;
    while ((idx = clean.indexOf('비오', idx)) !== null && idx !== -1) {
      console.log('Snippet:', clean.substring(idx - 50, idx + 100));
      idx += 2;
      if (idx > clean.length || count++ > 10) break;
    }
  }
}

main();
