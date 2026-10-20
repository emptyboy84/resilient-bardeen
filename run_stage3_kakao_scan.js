const fs = require('fs');

function cleanName(raw) {
  if (!raw) return '';
  return raw
    .replace(/\(주\)/g, '')
    .replace(/주식회사/g, '')
    .replace(/\(유\)/g, '')
    .replace(/\(합\)/g, '')
    .replace(/\(유책\)/g, '')
    .replace(/유한책임회사/g, '')
    .replace(/유한회사/g, '')
    .trim();
}

function cleanPhoneNumber(raw) {
  if (!raw) return null;
  let p = raw.trim().replace(/<[^>]+>/g, '').trim();
  p = p.replace(/^\+82\s*/, '');
  if (p.startsWith('51-')) p = '0' + p;
  if (p.startsWith('2-')) p = '0' + p;
  if (p.startsWith('10-')) p = '0' + p;
  if (p.startsWith('31-')) p = '0' + p;
  if (p.startsWith('70-')) p = '0' + p;

  const prefixMatch = p.match(/^(?:02|051|031)-(1[568][0-9]{2}-[0-9]{4})$/);
  if (prefixMatch) p = prefixMatch[1];

  // Exclude invalid CS numbers
  if (['02-1577-0000', '1577-0000', '02-6226-5000', '02-6937-0035'].includes(p)) return null;

  // Masked 010
  if (/^01[016789]-[0-9]{3,4}-[0-9*]{4}$/.test(p)) return p;

  // Full phone regex
  const fullRegex = /^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|070|01[016789])-[0-9]{3,4}-[0-9]{4}$|^(15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$|^(050[0-9]?)-[0-9]{3,4}-[0-9]{4}$/;
  if (fullRegex.test(p)) {
    if (/^[0-9]{3}-[0-9]{2}-[0-9]{5}$/.test(p)) return null;
    return p;
  }
  return null;
}

function isAddressMatch(targetAddr, placeAddr) {
  if (!placeAddr) return false;
  // Must be in Busan or surrounding
  if (!placeAddr.includes('부산')) return false;

  // Extract gu (해운대구, 사상구 등)
  const targetGu = targetAddr.match(/([가-힣]+구)/);
  if (targetGu && !placeAddr.includes(targetGu[1])) {
    return false; // different district in Busan
  }

  // Extract dong or road name
  const targetDongOrRoad = targetAddr.match(/([가-힣0-9]+(?:동|로|길))/g) || [];
  for (const part of targetDongOrRoad) {
    if (part.length >= 2 && placeAddr.includes(part)) {
      return true;
    }
  }

  // If district matches and name is unique enough, count as matched
  return true;
}

async function fetchKakaoPlace(name, address) {
  const cName = cleanName(name);
  if (!cName || cName.length < 2) return null;

  const query = encodeURIComponent(cName + ' 부산');
  const url = `https://search.map.kakao.com/mapsearch/map.daum?q=${query}&msFlag=A&sort=0`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.place || data.place.length === 0) return null;

    for (const p of data.place) {
      if (!p.tel || p.tel.trim().length === 0) continue;

      const pName = cleanName(p.name);
      // Check if place name closely matches company name
      const nameMatch = pName.includes(cName) || cName.includes(pName);
      if (!nameMatch) continue;

      const fullPlaceAddr = (p.address || '') + ' ' + (p.new_address || '');
      if (isAddressMatch(address, fullPlaceAddr)) {
        const cleanedTel = cleanPhoneNumber(p.tel);
        if (cleanedTel) {
          return {
            tel: cleanedTel,
            placeName: p.name,
            placeAddr: p.new_address || p.address
          };
        }
      }
    }
  } catch (e) {}
  return null;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runKakaoScan() {
  const missingTargets = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
  const stage1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
  let stage2 = {};
  if (fs.existsSync('stage2_results.json')) {
    stage2 = JSON.parse(fs.readFileSync('stage2_results.json', 'utf8'));
  }

  // Identify targets that need scanning:
  // 1) Totally missing
  // 2) Currently only has a masked phone number
  const targets = missingTargets.filter(item => {
    const cleanBiz = item.bizNo.replace(/[^0-9]/g, '');
    const s1 = stage1[cleanBiz];
    const s2 = stage2[cleanBiz];
    const existingPhone = s1 || (s2 ? (typeof s2 === 'object' ? s2.phone : s2) : null);

    if (!existingPhone) return true; // totally missing
    if (existingPhone.includes('*')) return true; // masked, can upgrade!
    return false;
  });

  console.log(`Total companies to scan with Kakao Map: ${targets.length}`);

  let results = {};
  if (fs.existsSync('stage3_kakao_results.json')) {
    try {
      results = JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8'));
      console.log(`Loaded ${Object.keys(results).length} existing Kakao progress`);
    } catch (e) {}
  }

  const batchSize = 8;
  let newFoundCount = 0;
  let upgradedCount = 0;

  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);

    await Promise.all(batch.map(async item => {
      const cleanBiz = item.bizNo.replace(/[^0-9]/g, '');
      if (results[cleanBiz]) return; // already processed

      const hit = await fetchKakaoPlace(item.name, item.address);
      if (hit) {
        results[cleanBiz] = {
          seq: item.seq,
          name: item.name,
          bizNo: item.bizNo,
          phone: hit.tel,
          placeName: hit.placeName,
          placeAddr: hit.placeAddr,
          source: 'KakaoMap'
        };

        const prevPhone = stage1[cleanBiz] || (stage2[cleanBiz] ? (typeof stage2[cleanBiz] === 'object' ? stage2[cleanBiz].phone : stage2[cleanBiz]) : null);
        if (prevPhone && prevPhone.includes('*')) {
          upgradedCount++;
        } else {
          newFoundCount++;
        }

        if ((newFoundCount + upgradedCount) <= 20 || (newFoundCount + upgradedCount) % 50 === 0) {
          console.log(`[KAKAO FOUND ${newFoundCount + upgradedCount}] Seq ${item.seq} ${item.name} -> ${hit.tel} (${hit.placeAddr})`);
        }
      }
    }));

    if (i % 80 === 0 || i + batchSize >= targets.length) {
      fs.writeFileSync('stage3_kakao_results.json', JSON.stringify(results, null, 2), 'utf8');
      console.log(`Progress: ${Math.min(i + batchSize, targets.length)} / ${targets.length} | Found new: ${newFoundCount}, Upgraded: ${upgradedCount}`);
    }

    await sleep(40);
  }

  fs.writeFileSync('stage3_kakao_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== Kakao Map Deep Scan Complete ===`);
  console.log(`Total Kakao matches found: ${Object.keys(results).length}`);
  console.log(`New blank filled: ${newFoundCount}`);
  console.log(`Masked numbers upgraded: ${upgradedCount}`);
}

runKakaoScan();
