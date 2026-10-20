const fs = require('fs');

const deepTargets = JSON.parse(fs.readFileSync('deep_targets_2277.json', 'utf8'));

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

  // Exclude invalid portal / CS numbers
  const invalidCS = [
    '02-1577-0000', '1577-0000', '02-6226-5000', '02-6937-0035',
    '02-3771-1514', '1577-3321', '1588-3333', '1588-2121', '1544-0001'
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

    // 1. Local place block: class="fn_tit" ... <span class="f_url">PHONE</span> ... <span class="txt_address">ADDR</span>
    const placeRegex = /class="fn_tit"[\s\S]*?(?:class="txt_address"[\s\S]*?<\/div>|<\/li>)/g;
    const placeBlocks = html.match(placeRegex) || [];
    for (const block of placeBlocks) {
      const pMatch = block.match(/<span class="f_url">([0-9\-]+)<\/span>/);
      const addrMatch = block.match(/class="txt_address">([^<]+)<\/span>/);
      if (pMatch) {
        const phone = cleanPhoneNumber(pMatch[1]);
        const pAddr = addrMatch ? addrMatch[1] : '';
        if (phone && (verifyAddressMatch(addr, pAddr) || verifyAddressMatch(addr, block))) {
          return { source: 'Daum-Local', phone, detail: pAddr };
        }
      }
    }

    // 2. Web / Snippet search
    const phones = html.match(/(?:051|02|070|010|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g) || [];
    for (const rawP of phones) {
      const phone = cleanPhoneNumber(rawP);
      if (phone) {
        const idx = html.indexOf(rawP);
        const snippet = html.substring(Math.max(0, idx - 200), Math.min(html.length, idx + 200));
        if (snippet.includes(cName) && verifyAddressMatch(addr, snippet)) {
          return { source: 'Daum-Web', phone, detail: snippet.replace(/<[^>]+>/g, ' ').substring(0, 80) };
        }
      }
    }
  } catch (e) {}
  return null;
}

async function test20() {
  const sample = deepTargets.slice(0, 30);
  console.log(`Testing Daum Search on 30 sample targets...`);
  let hits = 0;
  for (const item of sample) {
    const cName = cleanName(item.name);
    const hit = await searchDaum(cName, item.address);
    if (hit) {
      hits++;
      console.log(`[HIT ${hits}] Seq ${item.seq} ${item.name} (${item.bizNo}) -> ${hit.phone} [${hit.source}] | ${hit.detail}`);
    } else {
      console.log(`[MISS] Seq ${item.seq} ${item.name}`);
    }
  }
  console.log(`\nFinished 30 samples: Hits = ${hits} (${(hits / 30 * 100).toFixed(1)}%)`);
}

test20();
