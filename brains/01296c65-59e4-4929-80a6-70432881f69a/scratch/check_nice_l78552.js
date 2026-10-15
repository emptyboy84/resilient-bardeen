const https = require('https');

function getNice(kiscode) {
  return new Promise((resolve, reject) => {
    const url = `https://www.nicebizinfo.com/ep/EP0100M002GE.nice?kiscode=${kiscode}`;
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
  const html = await getNice('L78552');
  console.log('NICE html length:', html.length);
  const clean = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[\s\S]*?<\/style>/gi, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ');
  
  // print parts containing 휴업 or 상태
  console.log(clean.substring(clean.indexOf('기업개요'), clean.indexOf('기업개요') + 1500));
}

main();
