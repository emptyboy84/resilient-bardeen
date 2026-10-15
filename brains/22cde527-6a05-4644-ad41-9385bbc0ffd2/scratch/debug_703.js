const fs = require('fs');
const path = require('path');
const https = require('https');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterList = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'master_verified_194.json'), 'utf8'));
const item = masterList.find(x => x.rowNumber === 703);

console.log('Item 703:', item);

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'Referer': 'https://www.saramin.co.kr/'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', err => resolve({ status: 500, error: err.message }));
  });
}

async function test() {
  const query = item.name.replace(/주식회사|\(주\)|유한회사|\(유\)/g, '').trim();
  console.log('Query:', query);
  const searchUrl = `https://www.saramin.co.kr/zf_user/search/company?searchword=${encodeURIComponent(query)}`;
  const searchRes = await fetchUrl(searchUrl);
  const items = searchRes.data.split('class="item_corp"');
  console.log('Items count:', items.length - 1);
  for (let i = 1; i < items.length; i++) {
    const chunk = items[i].substring(0, 1500);
    const linkMatch = chunk.match(/href="([^"]+csn=[^"]+)"/);
    console.log(`Item ${i} linkMatch:`, linkMatch ? linkMatch[1] : 'none');
    if (linkMatch) {
      let detailUrl = linkMatch[1];
      if (!detailUrl.startsWith('http')) detailUrl = 'https://www.saramin.co.kr' + detailUrl;
      const detailRes = await fetchUrl(detailUrl);
      console.log(`Item ${i} detail status:`, detailRes.status, 'len:', detailRes.data.length);
      console.log(`Includes CEO ${item.ceo}:`, detailRes.data.includes(item.ceo));
      console.log(`Includes 부산:`, detailRes.data.includes('부산'));
      // Check summaryRegex
      const summaryRegex = /<strong class="company_summary_tit">\s*([^<]+)\s*<\/strong>[\s\S]*?<p class="company_summary_desc">\s*매출액\s*<\/p>/;
      const revMatch = detailRes.data.match(summaryRegex);
      console.log('revMatch:', revMatch);
    }
  }
}

test();
