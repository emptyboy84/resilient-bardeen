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

function verifyAddressMatch(targetAddr, snippetText) {
  if (!snippetText) return false;
  if (!snippetText.includes('부산')) return false;

  const targetGu = targetAddr.match(/([가-힣]+구)/);
  if (targetGu && !snippetText.includes(targetGu[1])) {
    return false; // different district
  }

  const parts = targetAddr.match(/([가-힣0-9]+(?:동|로|길))/g) || [];
  for (const part of parts) {
    if (part.length >= 2 && snippetText.includes(part)) {
      return true;
    }
  }
  return true;
}

async function searchNaver(cName, address) {
  const query = `${cName} 부산 전화번호`;
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(query);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    // 1. Direct SmartPlace phone tag
    const placeMatch = html.match(/<span class="LDgIH">([0-9\-]+)<\/span>/);
    if (placeMatch) {
      const phone = cleanPhoneNumber(placeMatch[1]);
      if (phone) return { phone, source: 'Naver-Place' };
    }

    // 2. Snippet match with address check
    const telMatch = html.match(/(?:전화|연락처|TEL|대표번호)[^0-9<]{0,20}([0-9]{2,4}-[0-9]{3,4}-[0-9]{4})/i);
    if (telMatch) {
      const phone = cleanPhoneNumber(telMatch[1]);
      if (phone && verifyAddressMatch(address, html.substring(Math.max(0, html.indexOf(telMatch[1]) - 200), html.indexOf(telMatch[1]) + 200))) {
        return { phone, source: 'Naver-Search' };
      }
    }
  } catch (e) {}
  return null;
}

async function search114(cName, address) {
  const query = `${cName} 부산`;
  const url = 'https://www.114.co.kr/search/result/all?query=' + encodeURIComponent(query);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    const phones = html.match(/(?:051|02|070|010|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g) || [];
    for (const rawPhone of phones) {
      const phone = cleanPhoneNumber(rawPhone);
      if (phone) {
        const idx = html.indexOf(rawPhone);
        const snippet = html.substring(Math.max(0, idx - 200), Math.min(html.length, idx + 200));
        if (snippet.includes(cName) && verifyAddressMatch(address, snippet)) {
          return { phone, source: '114On' };
        }
      }
    }
  } catch (e) {}
  return null;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runStage4() {
  const missingTargets = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
  const stage1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
  const stage2 = fs.existsSync('stage2_results.json') ? JSON.parse(fs.readFileSync('stage2_results.json', 'utf8')) : {};
  const stage3 = fs.existsSync('stage3_kakao_results.json') ? JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8')) : {};

  // Filter strictly those that still don't have an unmasked phone
  const targets = missingTargets.filter(item => {
    const biz = item.bizNo.replace(/[^0-9]/g, '');
    const p1 = stage1[biz];
    const p2 = stage2[biz] ? (typeof stage2[biz] === 'object' ? stage2[biz].phone : stage2[biz]) : null;
    const p3 = stage3[biz] ? stage3[biz].phone : null;
    const current = p3 || p2 || p1;
    if (!current) return true;
    if (current.includes('*')) return true; // can be upgraded
    return false;
  });

  console.log(`Starting Stage 4 Deep Sweep for ${targets.length} targets...`);

  let results = {};
  if (fs.existsSync('stage4_results.json')) {
    try {
      results = JSON.parse(fs.readFileSync('stage4_results.json', 'utf8'));
      console.log(`Loaded ${Object.keys(results).length} existing Stage 4 progress`);
    } catch(e) {}
  }

  const batchSize = 6;
  let newFound = 0;

  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);

    await Promise.all(batch.map(async item => {
      const cleanBiz = item.bizNo.replace(/[^0-9]/g, '');
      if (results[cleanBiz]) return;

      const cName = cleanName(item.name);
      if (!cName || cName.length < 2) return;

      // Query Naver Search and 114
      const [naverHit, hit114] = await Promise.all([
        searchNaver(cName, item.address),
        search114(cName, item.address)
      ]);

      const hit = naverHit || hit114;
      if (hit) {
        results[cleanBiz] = {
          seq: item.seq,
          name: item.name,
          phone: hit.phone,
          source: hit.source
        };
        newFound++;
        if (newFound <= 20 || newFound % 30 === 0) {
          console.log(`[STAGE 4 HIT ${newFound}] Seq ${item.seq} ${item.name} -> ${hit.phone} (${hit.source})`);
        }
      }
    }));

    if (i % 60 === 0 || i + batchSize >= targets.length) {
      fs.writeFileSync('stage4_results.json', JSON.stringify(results, null, 2), 'utf8');
      console.log(`Stage 4 Progress: ${Math.min(i + batchSize, targets.length)} / ${targets.length} | Found so far: ${newFound}`);
    }

    await sleep(40);
  }

  fs.writeFileSync('stage4_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== Stage 4 Sweep Complete ===`);
  console.log(`Total new Stage 4 verified phones: ${Object.keys(results).length}`);
}

runStage4();
