const fs = require('fs');

async function testImprovedKakao() {
  const missingTargets = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
  const stage1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
  const stage2 = fs.existsSync('stage2_results.json') ? JSON.parse(fs.readFileSync('stage2_results.json', 'utf8')) : {};
  const stage3 = fs.existsSync('stage3_kakao_results.json') ? JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8')) : {};

  const stillMissing = missingTargets.filter(item => {
    const biz = item.bizNo.replace(/[^0-9]/g, '');
    const p1 = stage1[biz];
    const p2 = stage2[biz] ? (typeof stage2[biz] === 'object' ? stage2[biz].phone : stage2[biz]) : null;
    const p3 = stage3[biz] ? stage3[biz].phone : null;
    const cur = p3 || p2 || p1;
    return !cur;
  });

  console.log(`Total completely missing before improved test: ${stillMissing.length}`);

  const sample = stillMissing.slice(0, 50);
  let found = 0;

  for (const item of sample) {
    const cName = item.name.replace(/\(주\)|주식회사|\(유\)|\(합\)|\(유책\)/g, '').trim();
    if (cName.length < 2) continue;

    // Search pure cleanName
    const url = `https://search.map.kakao.com/mapsearch/map.daum?q=${encodeURIComponent(cName)}&msFlag=A&sort=0`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const data = await res.json();
      if (data.place && data.place.length > 0) {
        for (const p of data.place) {
          if (!p.tel || p.tel.trim().length === 0) continue;
          const pAddr = (p.address || '') + ' ' + (p.new_address || '');
          if (!pAddr.includes('부산')) continue;

          // Check district or road match
          const targetGu = item.address.match(/([가-힣]+구)/);
          if (targetGu && !pAddr.includes(targetGu[1])) continue;

          console.log(`[IMPROVED HIT] Seq ${item.seq} ${item.name} -> ${p.tel} (${p.name} / ${p.new_address || p.address})`);
          found++;
          break;
        }
      }
    } catch(e) {}
    await new Promise(r => setTimeout(r, 40));
  }

  console.log(`\nSample 50 Result: Found ${found} / 50 (${(found/50*100).toFixed(1)}%)`);
}

testImprovedKakao();
