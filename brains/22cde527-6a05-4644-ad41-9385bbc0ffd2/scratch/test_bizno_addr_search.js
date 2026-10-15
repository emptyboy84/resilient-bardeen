const https = require('https');
const fs = require('fs');

function searchBizno(q) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/?query=' + encodeURIComponent(q), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 6000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

function extractBiznoResults(html) {
  const regex = /<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const results = [];
  const seen = new Set();
  while ((match = regex.exec(html)) !== null) {
    const b = match[1];
    if (!seen.has(b)) {
      seen.add(b);
      const title = match[2].replace(/<[^>]+>/g, '').trim();
      results.push({ bizno: b, title });
    }
  }
  return results;
}

async function test() {
  const queries = [
    { target: '라온엔터테인먼트 신모라공단', q: '신모라공단 903' },
    { target: '동아대학교출판부', q: '051-200-6281' },
    { target: '무몽크 금정로 90-1', q: '금정로 90-1' },
    { target: '도서출판일광 차성로', q: '차성로344번길 13' },
    { target: '동화사 초량동', q: '051-464-0761' },
    { target: '동그라미광고공사 정지후', q: '정지후' },
    { target: '녹생광고연합그린하우징 박명섭', q: '박명섭' },
    { target: '블루호텔레코딩스튜디오 김현', q: '010-3568-1004' },
    { target: '단디콤', q: '051-313-3449' }
  ];

  for (const item of queries) {
    const html = await searchBizno(item.q);
    const res = extractBiznoResults(html);
    console.log(`=== [${item.target}] query: "${item.q}" ===`);
    res.slice(0, 4).forEach(r => console.log(`  Bizno: ${r.bizno} | Title: ${r.title}`));
  }
}

test();
