const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function inspectSaramin() {
  const data = await fetchUrl('https://www.saramin.co.kr/zf_user/search/company?searchword=' + encodeURIComponent('브이드림'));
  // Extract company search items
  const items = data.split('class="item_corp"');
  console.log('Company items found:', items.length - 1);
  for (let i = 1; i < Math.min(items.length, 5); i++) {
    const chunk = items[i].substring(0, 1500);
    // extract corp name
    const nameMatch = chunk.match(/title="([^"]+)"/) || chunk.match(/class="corp_name"[^>]*>([^<]+)/);
    const linkMatch = chunk.match(/href="([^"]+)"/);
    const infoMatch = chunk.match(/<div class="corp_info">([\s\S]*?)<\/div>/);
    console.log(`\n--- Item ${i} ---`);
    console.log('Name:', nameMatch ? nameMatch[1].trim() : 'N/A');
    console.log('Link:', linkMatch ? linkMatch[1] : 'N/A');
    if (infoMatch) {
      console.log('Info:', infoMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    }
  }
}

inspectSaramin();
