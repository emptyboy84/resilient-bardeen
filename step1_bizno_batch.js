const fs = require('fs');

// 대한민국 전화번호 유효성 검사 함수
function isValidKoreanPhone(phone) {
  if (!phone) return false;
  const p = phone.trim().replace(/[^0-9\-]/g, '');
  
  // 일반 지역번호, 070, 010, 15xx/16xx/18xx 등
  const regex = /^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|070|01[016789])-[0-9]{3,4}-[0-9]{4}$|^(15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$|^(050[0-9]?)-[0-9]{3,4}-[0-9]{4}$/;
  if (!regex.test(p)) return false;

  // 사업자번호 패턴(3-2-5 형식)과 유사한지 체크
  // 예: 867-81-00135 가 잘못 들어간 경우 방지
  if (/^[0-9]{3}-[0-9]{2}-[0-9]{5}$/.test(p)) return false;
  
  return true;
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

    // 1. Check direct table row <th>전화번호</th>
    const thMatch = html.match(/<th>전화번호<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    if (thMatch) {
      const inner = thMatch[1];
      // Do not match tax office phone
      if (inner.includes('세무서')) return null;

      const telMatch = inner.match(/<a href=['"]tel:([^'"]+)['"]/) || inner.match(/([0-9]{2,4}-[0-9]{3,4}-[0-9]{4}|1[0-9]{3}-[0-9]{4})/);
      if (telMatch) {
        const candidate = telMatch[1].trim();
        if (isValidKoreanPhone(candidate)) {
          return candidate;
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function runStep1() {
  const targets = JSON.parse(fs.readFileSync('missing_phone_targets.json', 'utf8'));
  console.log(`Starting Step 1 Bizno check for ${targets.length} companies...`);

  const results = {};
  // Load existing if exists
  if (fs.existsSync('step1_results.json')) {
    Object.assign(results, JSON.parse(fs.readFileSync('step1_results.json', 'utf8')));
  }

  const batchSize = 5;
  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    await Promise.all(batch.map(async (item) => {
      if (results[item.seq] && results[item.seq].phone) {
        return; // already found
      }
      const phone = await fetchBizno(item.bizNo);
      results[item.seq] = {
        seq: item.seq,
        name: item.name,
        ceo: item.ceo,
        bizNo: item.bizNo,
        corpNo: item.corpNo,
        address: item.address,
        phone: phone || '',
        source: phone ? '비즈노(공식등록)' : ''
      };
      if (phone) {
        console.log(`[FOUND] ${item.seq} ${item.name} -> ${phone}`);
      }
    }));

    // Save progress every batch
    fs.writeFileSync('step1_results.json', JSON.stringify(results, null, 2), 'utf8');
    
    if (i % 20 === 0 || i + batchSize >= targets.length) {
      const foundCount = Object.values(results).filter(r => r.phone).length;
      console.log(`Progress: ${Math.min(i + batchSize, targets.length)}/${targets.length} (Found: ${foundCount})`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  const totalFound = Object.values(results).filter(r => r.phone).length;
  console.log(`\nStep 1 Complete! Found ${totalFound} / ${targets.length} phones.`);
}

runStep1();
