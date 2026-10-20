const fs = require('fs');

async function testBiznoQuery() {
  const list = [
    { name: '(주)에스오더', biz: '355-88-02361', corp: '120111-1204742' },
    { name: '(주)스튜디오정글', biz: '819-86-02478', corp: '180111-1398329' },
    { name: '아타드(주)', biz: '512-86-02989', corp: '110111-8524640' },
    { name: '(주)저스티스어드벤처', biz: '177-81-00390', corp: '180111-1047306' },
    { name: '(주)에이엠매니지먼트', biz: '388-87-02272', corp: '110111-8114566' },
    { name: '(주)메이브릿지', biz: '751-81-03079', corp: '180111-1487510' },
    { name: '(주)썬더게임즈', biz: '867-81-00135', corp: '110111-5796812' }
  ];

  for (const item of list) {
    // 1. Try search by clean corpNo
    let found = null;
    if (item.corp) {
      const cleanCorp = item.corp.replace(/[^0-9]/g, '');
      const url = 'https://bizno.net/?query=' + cleanCorp;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const articles = [...new Set(html.match(/\/article\/[0-9]+/g) || [])];
      console.log(`Corp Search ${item.name} (${item.corp}) -> ${articles.length} articles`);
      for (const art of articles) {
        const artRes = await fetch('https://bizno.net' + art, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const artHtml = await artRes.text();
        const thMatch = artHtml.match(/<th>전화번호<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
        if (thMatch && !thMatch[1].includes('세무서')) {
          const tel = thMatch[1].match(/([0-9]{2,4}-[0-9]{3,4}-[0-9]{4}|1[0-9]{3}-[0-9]{4})/);
          if (tel) {
            console.log(`  -> Found via corp article ${art}: ${tel[1]}`);
            found = tel[1];
            break;
          }
        }
      }
    }
  }
}
testBiznoQuery();
