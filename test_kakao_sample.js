const fs = require('fs');

async function testKakaoOnMissingSample() {
  const missing = JSON.parse(fs.readFileSync('pure_missing_2658.json', 'utf8'));
  const stage2 = JSON.parse(fs.readFileSync('stage2_results.json', 'utf8'));

  // Filter those still completely missing in stage2
  const stillMissing = missing.filter(m => !stage2[m.bizNo.replace(/[^0-9]/g, '')]);
  console.log('Still missing count:', stillMissing.length);

  const sample = stillMissing.slice(0, 30);
  let kakaoFound = 0;

  for (const item of sample) {
    const cleanName = item.name.replace(/\(주\)|주식회사|\(유\)|\(합\)/g, '').trim();
    const query = encodeURIComponent(cleanName + ' 부산');
    const url = `https://search.map.kakao.com/mapsearch/map.daum?q=${query}&msFlag=A&sort=0`;

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const data = await res.json();
      if (data.place && data.place.length > 0) {
        // Find matching place by address or name
        for (const p of data.place) {
          if (p.tel && p.tel.trim().length > 0) {
            // Check if address matches Busan or gu/dong
            const pAddr = p.address + ' ' + (p.new_address || '');
            const itemDong = (item.address.match(/([가-힣]+[구|동|로|길])/g) || []).slice(0, 3);
            const addrMatch = itemDong.some(d => pAddr.includes(d));

            if (addrMatch || p.name.includes(cleanName)) {
              console.log(`[KAKAO MATCH] Seq ${item.seq} ${item.name} -> ${p.tel} (${p.name} / ${p.new_address || p.address})`);
              kakaoFound++;
              break;
            }
          }
        }
      }
    } catch(e) {}
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\nSample 30 Kakao test: Found ${kakaoFound} / 30 (${(kakaoFound/30*100).toFixed(1)}%)`);
}

testKakaoOnMissingSample();
