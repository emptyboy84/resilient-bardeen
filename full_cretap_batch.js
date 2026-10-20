const fs = require('fs');

function isValidKoreanPhone(phone) {
  if (!phone) return false;
  const p = phone.trim().replace(/[^0-9\-]/g, '');
  
  const regex = /^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|070|01[016789])-[0-9]{3,4}-[0-9]{4}$|^(15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$|^(050[0-9]?)-[0-9]{3,4}-[0-9]{4}$/;
  if (!regex.test(p)) return false;

  // 사업자번호 패턴(3-2-5 형식) 방지
  if (/^[0-9]{3}-[0-9]{2}-[0-9]{5}$/.test(p)) return false;
  if (p === '02-1577-0000' || p === '1577-0000') return false;
  
  return true;
}

function cleanPhonePrefix(phone) {
  if (!phone) return '';
  // 02-15xx, 02-16xx, 051-16xx
  const m = phone.match(/^(?:02|051|031)-(1[568][0-9]{2}-[0-9]{4})$/);
  if (m) return m[1];
  return phone;
}

async function fetchBizno(bizNo) {
  const clean = bizNo.replace(/[^0-9]/g, '');
  if (clean.length !== 10) return null;

  const url = 'https://bizno.net/article/' + clean;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    const thMatch = html.match(/<th>전화번호<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    if (thMatch) {
      const inner = thMatch[1];
      if (inner.includes('세무서')) return null;

      const telMatch = inner.match(/<a href=['"]tel:([^'"]+)['"]/) || inner.match(/([0-9]{2,4}-[0-9]{3,4}-[0-9]{4}|1[0-9]{3}-[0-9]{4})/);
      if (telMatch) {
        let candidate = telMatch[1].trim();
        candidate = cleanPhonePrefix(candidate);
        if (isValidKoreanPhone(candidate)) {
          return candidate;
        }
      }
    }
  } catch (e) {
    // network error
  }
  return null;
}

async function runFullBatch() {
  const targets = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
  console.log(`Starting Full Batch check for ${targets.length} missing companies...`);

  const results = {};
  // Load existing step1 if available
  if (fs.existsSync('step1_results.json')) {
    const prev = JSON.parse(fs.readFileSync('step1_results.json', 'utf8'));
    for (const [k, v] of Object.entries(prev)) {
      if (v.bizNo && v.phone) {
        const cleanBiz = v.bizNo.replace(/[^0-9]/g, '');
        results[cleanBiz] = v.phone;
      }
    }
  }
  // Load progress file if exists
  if (fs.existsSync('full_cretap_results.json')) {
    Object.assign(results, JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8')));
  }

  console.log(`Initial cached phones available: ${Object.keys(results).length}`);

  const batchSize = 6;
  let newFoundCount = 0;

  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    await Promise.all(batch.map(async (item) => {
      const cleanBiz = item.bizNo.replace(/[^0-9]/g, '');
      if (cleanBiz.length !== 10) return;
      if (results[cleanBiz]) return; // already found

      const phone = await fetchBizno(item.bizNo);
      if (phone) {
        results[cleanBiz] = phone;
        newFoundCount++;
        if (newFoundCount <= 20 || newFoundCount % 50 === 0) {
          console.log(`[FOUND ${newFoundCount}] Seq ${item.seq} ${item.name} -> ${phone}`);
        }
      }
    }));

    if (i % 30 === 0 || i + batchSize >= targets.length) {
      fs.writeFileSync('full_cretap_results.json', JSON.stringify(results, null, 2), 'utf8');
      const totalFound = Object.keys(results).length;
      console.log(`Progress: ${Math.min(i + batchSize, targets.length)}/${targets.length} | Total Found: ${totalFound}`);
    }

    await new Promise(r => setTimeout(r, 250));
  }

  fs.writeFileSync('full_cretap_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nAll done! Total verified phones collected: ${Object.keys(results).length}`);
}

runFullBatch();
