const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function searchBizno(query) {
  const url = 'https://bizno.net/?query=' + encodeURIComponent(query);
  const html = await fetchUrl(url);
  const regex = /<a\s+href="(\/article\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const results = [];
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text && !text.includes('로그인') && !text.includes('회원가입')) {
      results.push({ link: match[1], text });
    }
  }
  return results;
}

async function getDetail(articlePath) {
  const url = 'https://bizno.net' + articlePath;
  const html = await fetchUrl(url);
  const rows = {};
  const regex = /<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const th = match[1].replace(/<[^>]+>/g, '').trim();
    const td = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    rows[th] = td;
  }
  return rows;
}

async function main() {
  const queries = [
    '로파스튜디오',
    '야야토이',
    '주식회사하날',
    '에이치앤제이',
    '바나나러닝',
    '엠엔에이윅스',
    '깜냥깜냥',
    '루미너스'
  ];

  for (const q of queries) {
    console.log(`\n=== Query: ${q} ===`);
    try {
      const items = await searchBizno(q);
      console.log(`Found ${items.length} items`);
      for (const item of items.slice(0, 3)) {
        console.log(`- ${item.text} (${item.link})`);
        const detail = await getDetail(item.link);
        console.log(`  대표자: ${detail['대표자명'] || '-'}, 사업자: ${detail['사업자등록번호'] || '-'}, 상태: ${detail['사업자 현재 상태'] || '-'}, 주소: ${detail['회사주소'] || '-'}`);
      }
    } catch (e) {
      console.error(e.message);
    }
    await new Promise(r => setTimeout(r, 200));
  }
}

main().catch(console.error);
