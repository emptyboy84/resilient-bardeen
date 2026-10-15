const https = require('https');

function searchSaramin(query) {
  return new Promise((resolve, reject) => {
    const url = `https://www.saramin.co.kr/zf_user/search/company?searchword=${encodeURIComponent(query)}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function test() {
  const d = await searchSaramin('피커스튜디오');
  console.log('Result len:', d.length);
  const items = d.split('class="item_corp"');
  console.log('Items found:', items.length - 1);
  for (let i = 1; i < items.length; i++) {
    const chunk = items[i].substring(0, 1500);
    const nameMatch = chunk.match(/title="([^"]+)"/) || chunk.match(/class="corp_name"[^>]*>([^<]+)/);
    const linkMatch = chunk.match(/href="([^"]+)"/);
    console.log(`Item ${i}:`, nameMatch ? nameMatch[1].trim() : 'N/A', 'Link:', linkMatch ? linkMatch[1] : 'N/A');
  }
}

test();
