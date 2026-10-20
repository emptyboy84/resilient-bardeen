const fs = require('fs');

async function testSample100() {
  const targets = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
  const results = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
  const stillMissing = targets.filter(t => !results[t.bizNo.replace(/[^0-9]/g, '')]);
  console.log('Total still missing:', stillMissing.length);

  const sample = stillMissing.slice(0, 100);
  let biznoMaskedCount = 0;
  let saraminFoundCount = 0;
  let saraminMatchedMasked = 0;

  for (let i = 0; i < sample.length; i++) {
    const item = sample[i];
    const cleanBiz = item.bizNo.replace(/[^0-9]/g, '');

    // 1. Check Bizno
    let biznoPhone = null;
    let biznoMasked = null;
    try {
      const bRes = await fetch('https://bizno.net/article/' + cleanBiz, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const bHtml = await bRes.text();
      const thMatch = bHtml.match(/<th>전화번호<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
      if (thMatch && !thMatch[1].includes('세무서')) {
        const text = thMatch[1].replace(/<[^>]+>/g, '').trim();
        const m = text.match(/(01[0-9]-[0-9]{3,4}-[0-9*]{4})/);
        if (m) {
          if (m[1].includes('*')) biznoMasked = m[1];
          else biznoPhone = m[1];
        }
      }
    } catch(e) {}

    // 2. Check Saramin
    let saraminPhone = null;
    try {
      const sRes = await fetch('https://www.saramin.co.kr/zf_user/company-info/view?csn=' + cleanBiz, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (sRes.ok) {
        const sHtml = await sRes.text();
        const jsonLdMatch = sHtml.match(/"telephone":"\+82\s*([^"]+)"/);
        const dtMatch = sHtml.match(/<dt>전화<\/dt>\s*<dd>([^<]+)<\/dd>/);
        saraminPhone = jsonLdMatch ? jsonLdMatch[1] : (dtMatch ? dtMatch[1].trim() : null);
      }
    } catch(e) {}

    if (biznoMasked) biznoMaskedCount++;
    if (saraminPhone) saraminFoundCount++;
    if (biznoMasked && saraminPhone) saraminMatchedMasked++;

    if (biznoMasked || saraminPhone) {
      console.log(`[${item.seq}] ${item.name} | BiznoMasked: ${biznoMasked || '-'} | Saramin: ${saraminPhone || '-'}`);
    }
  }

  console.log(`\n--- Summary of 100 sample ---`);
  console.log(`Bizno masked phones: ${biznoMaskedCount}/100`);
  console.log(`Saramin full phones: ${saraminFoundCount}/100`);
  console.log(`Both: ${saraminMatchedMasked}`);
}

testSample100();
