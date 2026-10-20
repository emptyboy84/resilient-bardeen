const fs = require('fs');

async function testNaverOnRemainingMissing() {
  const missingTargets = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
  const stage1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
  const stage2 = fs.existsSync('stage2_results.json') ? JSON.parse(fs.readFileSync('stage2_results.json', 'utf8')) : {};
  const stage3 = fs.existsSync('stage3_kakao_results.json') ? JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8')) : {};

  // Find remaining missing
  const stillMissing = missingTargets.filter(item => {
    const biz = item.bizNo.replace(/[^0-9]/g, '');
    const p1 = stage1[biz];
    const p2 = stage2[biz] ? (typeof stage2[biz] === 'object' ? stage2[biz].phone : stage2[biz]) : null;
    const p3 = stage3[biz] ? stage3[biz].phone : null;
    return !p1 && !p2 && !p3;
  });

  console.log(`Still missing count before Naver: ${stillMissing.length}`);

  const sample = stillMissing.slice(0, 20);
  let foundCount = 0;

  for (const item of sample) {
    const cleanName = item.name.replace(/\(주\)|주식회사|\(유\)|\(합\)/g, '').trim();
    const query = `${cleanName} 부산 전화번호`;
    const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(query);

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await res.text();

      // Look for SmartPlace phone or explicit contact in snippet
      const placeMatch = html.match(/<span class="LDgIH">([0-9\-]+)<\/span>/) || html.match(/(?:전화|연락처|TEL)[^0-9<]{0,20}([0-9]{2,4}-[0-9]{3,4}-[0-9]{4})/i);
      if (placeMatch) {
        const phone = placeMatch[1];
        if (!['02-1577-0000', '1577-0000', '02-6226-5000'].includes(phone)) {
          console.log(`[NAVER MATCH] Seq ${item.seq} ${item.name} -> ${phone}`);
          foundCount++;
        }
      }
    } catch(e) {}
    await new Promise(r => setTimeout(r, 60));
  }

  console.log(`\nSample 20 Naver test: Found ${foundCount} / 20 (${(foundCount/20*100).toFixed(1)}%)`);
}

testNaverOnRemainingMissing();
