const https = require('https');

async function fetchBiz(b) {
  return new Promise((resolve) => {
    https.get('https://bizno.net/article/' + b, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function check() {
  const list = [
    { name: '한국산업정보사', biz: '6075177864', targetCeo: '김삼절', targetAddr: '부산 동래구 중앙대로 1291-1' },
    { name: '페이크스튜디오', biz: '2734500967', targetCeo: '이제열', targetAddr: '부산 강서구 녹산산단381로 29' },
    { name: '디앤아이솔루션', biz: '6022261708', targetCeo: '이경은', targetAddr: '사하구 다대로300번길 25' }
  ];
  
  for (const item of list) {
    const html = await fetchBiz(item.biz);
    const m = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    console.log(`=== ${item.name} (${item.biz}) ===`);
    console.log('Target CEO:', item.targetCeo, '| Target Addr:', item.targetAddr);
    console.log('Meta description:', m ? m[1] : 'NOT_FOUND');
  }
}
check();
