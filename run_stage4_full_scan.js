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

// Tax offices & CS numbers blacklist
const TAX_OFFICE_NUMBERS = new Set([
  '051-750-7200', '051-620-9200', '051-780-6000', '051-780-6200',
  '051-810-0200', '051-860-2200', '051-559-0200', '051-580-6200',
  '051-460-0200', '051-461-9200', '051-240-0200', '051-310-6200',
  '051-970-0200', '051-750-7100', '051-750-7300', '051-780-6100'
]);

function cleanPhoneNumber(raw, contextText) {
  if (!raw) return null;
  let p = raw.trim().replace(/<[^>]+>/g, '').trim();
  p = p.replace(/^\+82\s*/, '');
  if (p.startsWith('51-')) p = '0' + p;
  if (p.startsWith('2-')) p = '0' + p;
  if (p.startsWith('10-')) p = '0' + p;
  if (p.startsWith('70-')) p = '0' + p;

  const prefixMatch = p.match(/^(?:02|051|031)-(1[568][0-9]{2}-[0-9]{4})$/);
  if (prefixMatch) p = prefixMatch[1];

  // Dummy phone filters
  if (/^[0-9]{2,3}-0000?-0000$/.test(p)) return null;
  if (/^[0-9]{2,3}-1111?-1111$/.test(p)) return null;
  if (/^[0-9]{2,3}-1234-5678$/.test(p)) return null;
  if (p === '051-000-0000' || p === '02-000-0000' || p === '010-0000-0000') return null;

  // Tax office check
  if (TAX_OFFICE_NUMBERS.has(p)) return null;
  if (/^051-[0-9]{3}-(?:0200|2200|6200|7200|9200)$/.test(p)) return null;

  // If context explicitly mentions 세무서 around the phone, reject
  if (contextText) {
    const idx = contextText.indexOf(raw);
    if (idx !== -1) {
      const near = contextText.substring(Math.max(0, idx - 80), Math.min(contextText.length, idx + 80));
      if (near.includes('세무서') || near.includes('국세청') || near.includes('관할')) return null;
    }
  }

  // Exclude invalid CS & portal numbers
  const invalidCS = [
    '02-1577-0000', '1577-0000', '02-6226-5000', '02-6937-0035',
    '02-3771-1514', '1577-3321', '1588-3333', '1588-2121', '1544-0001',
    '1588-0114', '114-114', '02-114', '1588-2222', '1544-7777',
    '02-2008-8888', '02-3488-8888', '1588-5114', '1588-1588', '1544-1544'
  ];
  if (invalidCS.includes(p)) return null;

  // Masked 010
  if (/^01[016789]-[0-9]{3,4}-[0-9*]{4}$/.test(p)) return p;

  // Full phone regex
  const fullRegex = /^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|070|01[016789])-[0-9]{3,4}-[0-9]{4}$|^(15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$|^(050[0-9]?)-[0-9]{3,4}-[0-9]{4}$/;
  if (fullRegex.test(p)) {
    if (/^[0-9]{3}-[0-9]{2}-[0-9]{5}$/.test(p)) return null; // BizNo pattern
    return p;
  }
  return null;
}

function verifyAddressMatch(targetAddr, snippetText) {
  if (!snippetText) return false;
  if (!snippetText.includes('부산')) return false;

  const targetGu = targetAddr.match(/([가-힣]+구|[가-힣]+군)/);
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

// 1. Daum Multi Search
async function searchDaum(cName, addr) {
  const query = `${cName} 부산`;
  const url = `https://search.daum.net/search?w=tot&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    // 1-A. Place Box
    const placeRegex = /class="fn_tit"[\s\S]*?(?:class="txt_address"[\s\S]*?<\/div>|<\/li>)/g;
    const placeBlocks = html.match(placeRegex) || [];
    for (const block of placeBlocks) {
      const pMatch = block.match(/<span class="f_url">([0-9\-]+)<\/span>/);
      const addrMatch = block.match(/class="txt_address">([^<]+)<\/span>/);
      if (pMatch) {
        const phone = cleanPhoneNumber(pMatch[1], block);
        const pAddr = addrMatch ? addrMatch[1] : '';
        if (phone && (verifyAddressMatch(addr, pAddr) || verifyAddressMatch(addr, block))) {
          return { source: 'Daum-Local', phone };
        }
      }
    }

    // 1-B. Web Doc Context Extraction
    const cleanSnippet = html.replace(/<[^>]+>/g, ' ');
    const regex = new RegExp('(?:^|[^가-힣])' + cName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:[^가-힣]|$)', 'g');
    let m;
    while ((m = regex.exec(cleanSnippet)) !== null) {
      const start = m.index;
      const chunk = cleanSnippet.substring(start, start + 300);
      if (verifyAddressMatch(addr, chunk)) {
        const telMatch = chunk.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/);
        if (telMatch) {
          const phone = cleanPhoneNumber(telMatch[0], chunk);
          if (phone) return { source: 'Daum-Web', phone };
        }
      }
    }
  } catch (e) {}
  return null;
}

// 2. Naver Search
async function searchNaver(cName, addr) {
  const query = `${cName} 부산 전화번호`;
  const url = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    // 2-A. Place tag
    const placeMatch = html.match(/<span class="LDgIH">([0-9\-]+)<\/span>/);
    if (placeMatch) {
      const phone = cleanPhoneNumber(placeMatch[1], html);
      if (phone) return { source: 'Naver-Place', phone };
    }

    // 2-B. Web Context
    const cleanSnippet = html.replace(/<[^>]+>/g, ' ');
    const regex = new RegExp('(?:^|[^가-힣])' + cName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:[^가-힣]|$)', 'g');
    let m;
    while ((m = regex.exec(cleanSnippet)) !== null) {
      const start = m.index;
      const chunk = cleanSnippet.substring(start, start + 300);
      if (verifyAddressMatch(addr, chunk)) {
        const telMatch = chunk.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/);
        if (telMatch) {
          const phone = cleanPhoneNumber(telMatch[0], chunk);
          if (phone) return { source: 'Naver-Web', phone };
        }
      }
    }
  } catch (e) {}
  return null;
}

// 3. Bizno Corp Query
async function searchBiznoCorp(corpNo) {
  if (!corpNo) return null;
  const cleanCorp = corpNo.replace(/[^0-9]/g, '');
  if (cleanCorp.length < 13) return null;
  const url = `https://bizno.net/?query=${cleanCorp}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    const html = await res.text();
    const articles = [...new Set(html.match(/\/article\/[0-9]+/g) || [])];
    if (articles.length === 1) {
      const artRes = await fetch('https://bizno.net' + articles[0], { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const artHtml = await artRes.text();
      const thMatch = artHtml.match(/<th>전화번호<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
      if (thMatch && !thMatch[1].includes('세무서')) {
        const tel = thMatch[1].match(/([0-9]{2,4}-[0-9]{3,4}-[0-9*]{4}|1[0-9]{3}-[0-9]{4})/);
        if (tel) {
          const phone = cleanPhoneNumber(tel[1], artHtml);
          if (phone) return { source: 'Bizno-Corp', phone };
        }
      }
    }
  } catch (e) {}
  return null;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runStage4Full() {
  const deepTargets = JSON.parse(fs.readFileSync('deep_targets_2277.json', 'utf8'));
  console.log(`=== Starting Stage 4 Full Multi-Platform Deep Scan (Cleaned Filters) ===`);
  console.log(`Total Targets: ${deepTargets.length}`);

  // Clean existing stage4_verified_results.json by removing any tax office or dummy numbers
  let results = {};
  if (fs.existsSync('stage4_verified_results.json')) {
    try {
      const raw = JSON.parse(fs.readFileSync('stage4_verified_results.json', 'utf8'));
      for (const [biz, val] of Object.entries(raw)) {
        if (cleanPhoneNumber(val.phone)) {
          results[biz] = val;
        }
      }
      console.log(`Purified existing results: kept ${Object.keys(results).length} clean verified entries`);
    } catch(e) {}
  }

  const batchSize = 5;
  let newFound = 0;
  let upgraded = 0;

  for (let i = 0; i < deepTargets.length; i += batchSize) {
    const batch = deepTargets.slice(i, i + batchSize);

    await Promise.all(batch.map(async item => {
      const cleanBiz = item.cleanBiz;
      if (results[cleanBiz]) return; // already processed

      const cName = cleanName(item.name);
      if (!cName || cName.length < 2) return;

      // 1. Daum
      let hit = await searchDaum(cName, item.address);

      // 2. Naver
      if (!hit) {
        hit = await searchNaver(cName, item.address);
      }

      // 3. Bizno Corp
      if (!hit && item.corpNo) {
        hit = await searchBiznoCorp(item.corpNo);
      }

      if (hit) {
        results[cleanBiz] = {
          seq: item.seq,
          name: item.name,
          phone: hit.phone,
          source: hit.source,
          was: item.currentPhone || 'NONE'
        };
        newFound++;
        if (item.currentPhone && item.currentPhone.includes('*')) {
          upgraded++;
        }

        if (newFound <= 30 || newFound % 15 === 0) {
          console.log(`[STAGE 4 HIT ${newFound}] Seq ${item.seq} ${item.name} -> ${hit.phone} [${hit.source}] (was: ${item.currentPhone || 'NONE'})`);
        }
      }
    }));

    if (i % 50 === 0 || i + batchSize >= deepTargets.length) {
      fs.writeFileSync('stage4_verified_results.json', JSON.stringify(results, null, 2), 'utf8');
      console.log(`Progress: ${Math.min(i + batchSize, deepTargets.length)} / ${deepTargets.length} | Total Clean Verified: ${Object.keys(results).length} (New Hits: ${newFound}, Upgrades: ${upgraded})`);
    }

    await sleep(30);
  }

  fs.writeFileSync('stage4_verified_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== Stage 4 Full Scan Complete ===`);
  console.log(`Total verified phones in Stage 4: ${Object.keys(results).length}`);
  console.log(`New hits in this run: ${newFound} (Upgraded from masked: ${upgraded})`);
}

runStage4Full();
