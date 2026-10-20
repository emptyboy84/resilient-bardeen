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
  if (p.startsWith('70-')) p = '0' + p;

  const prefixMatch = p.match(/^(?:02|051|031)-(1[568][0-9]{2}-[0-9]{4})$/);
  if (prefixMatch) p = prefixMatch[1];

  // Exclude invalid CS numbers
  const invalidCS = [
    '02-1577-0000', '1577-0000', '02-6226-5000', '02-6937-0035',
    '02-3771-1514', '1577-3321', '1588-3333', '1588-2121', '1544-0001',
    '1588-0114', '114-114', '02-114'
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
async function searchDaumMulti(cName, addr) {
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
        const phone = cleanPhoneNumber(pMatch[1]);
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
          const phone = cleanPhoneNumber(telMatch[0]);
          if (phone) return { source: 'Daum-Web', phone };
        }
      }
    }
  } catch (e) {}
  return null;
}

// 2. Naver Search
async function searchNaverMulti(cName, addr) {
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
      const phone = cleanPhoneNumber(placeMatch[1]);
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
          const phone = cleanPhoneNumber(telMatch[0]);
          if (phone) return { source: 'Naver-Web', phone };
        }
      }
    }
  } catch (e) {}
  return null;
}

// 3. Bizno Corp Query (for masked or alternate registrations)
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
    if (articles.length === 1) { // 1:1 match
      const artRes = await fetch('https://bizno.net' + articles[0], { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const artHtml = await artRes.text();
      const thMatch = artHtml.match(/<th>전화번호<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
      if (thMatch && !thMatch[1].includes('세무서')) {
        const tel = thMatch[1].match(/([0-9]{2,4}-[0-9]{3,4}-[0-9*]{4}|1[0-9]{3}-[0-9]{4})/);
        if (tel) {
          const phone = cleanPhoneNumber(tel[1]);
          if (phone) return { source: 'Bizno-Corp', phone };
        }
      }
    }
  } catch (e) {}
  return null;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runTestBatch50() {
  const deepTargets = JSON.parse(fs.readFileSync('deep_targets_2277.json', 'utf8'));
  const testSample = deepTargets.slice(0, 50);

  console.log(`Testing multi-platform scan on 50 sample targets...`);
  let found = 0;

  for (let i = 0; i < testSample.length; i++) {
    const item = testSample[i];
    const cName = cleanName(item.name);
    if (!cName || cName.length < 2) continue;

    // 1. Try Daum
    let hit = await searchDaumMulti(cName, item.address);

    // 2. Try Naver
    if (!hit) {
      hit = await searchNaverMulti(cName, item.address);
    }

    // 3. Try Bizno Corp
    if (!hit && item.corpNo) {
      hit = await searchBiznoCorp(item.corpNo);
    }

    if (hit) {
      found++;
      console.log(`[HIT ${found}] Seq ${item.seq} ${item.name} (${item.bizNo}) -> ${hit.phone} [${hit.source}] (was: ${item.currentPhone || 'NONE'})`);
    } else {
      // console.log(`[MISS] Seq ${item.seq} ${item.name}`);
    }

    await sleep(50);
  }

  console.log(`\nTest Complete: Found ${found} / 50 (${(found / 50 * 100).toFixed(1)}%)`);
}

runTestBatch50();
