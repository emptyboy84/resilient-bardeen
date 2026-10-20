const fs = require('fs');

const targets = JSON.parse(fs.readFileSync('missing_targets_phase2.json', 'utf8'));
const OUT_FILE = 'found_from_row498.json';
const results = fs.existsSync(OUT_FILE) ? JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')) : {};

const STRICT_PORTAL_CS_BLACKLIST = new Set([
  '02-6226-5000', '02-6937-0035', '02-6937-0039',
  '02-3771-1514', '1588-9356', '1588-3333',
  '1577-0000', '02-1577-0000', '02-2008-8888',
  '1588-0114', '114-114', '02-114'
]);

function cleanName(n) {
  return n.replace(/\(주\)/g, '')
          .replace(/주식회사/g, '')
          .replace(/\(유\)/g, '')
          .replace(/유한회사/g, '')
          .replace(/\(합\)/g, '')
          .replace(/\(사\)/g, '')
          .replace(/\(재\)/g, '')
          .trim();
}

function cleanPhone(raw) {
  if (!raw) return null;
  const p = raw.trim();
  if (STRICT_PORTAL_CS_BLACKLIST.has(p)) return null;
  if (/^051-[0-9]{3}-(?:0200|2200|6200|7200|9200)$/.test(p)) return null;

  // 1. Full standard landline/mobile/toll-free/smartcall
  if (/^(?:051|02|03[1-3]|04[1-4]|05[2-5]|06[1-4]|070|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}$|^(?:15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$/.test(p)) {
    // Avoid bizno format
    if (/^[0-9]{3}-[0-9]{2}-[0-9]{5}$/.test(p)) return null;
    return p;
  }

  // 2. Masked 010
  if (/^01[016789]-[0-9]{3,4}-[0-9*]{4}$/.test(p)) {
    return p;
  }

  return null;
}

async function fetchWithTimeout(url, opts = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function scanOne(t) {
  if (results[t.bno]) {
    return results[t.bno];
  }

  const cName = cleanName(t.name);
  let found = null;
  let source = null;

  // 1. Bizno
  try {
    const res = await fetchWithTimeout(`https://bizno.net/article/${t.bno}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, 3000);
    const text = await res.text();
    const thMatch = text.match(/<th>전화번호<\/th>\s*<td>([^<]+)<\/td>/);
    if (thMatch) {
      const p = cleanPhone(thMatch[1]);
      if (p) {
        found = p;
        source = 'Bizno-Official';
      }
    }
  } catch (e) {}

  // 2. Daum Local Place
  if (!found && cName.length >= 2) {
    try {
      const q = `${cName} 부산`;
      const url = `https://search.daum.net/search?w=tot&q=${encodeURIComponent(q)}`;
      const res = await fetchWithTimeout(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      }, 3500);
      const text = await res.text();
      const distMatch = t.address.match(/([가-힣]+[구군])/);
      const dist = distMatch ? distMatch[1] : '부산';
      if (text.includes(cName) && (text.includes(dist) || text.includes('부산'))) {
        const matches = text.match(/(?:051|02|070|010|0507|15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{3,4}-[0-9]{4}|(?:15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}/g);
        if (matches) {
          for (const m of matches) {
            const cp = cleanPhone(m);
            if (cp) {
              found = cp;
              source = 'Daum-Local';
              break;
            }
          }
        }
      }
    } catch (e) {}
  }

  // 3. Naver Place
  if (!found && cName.length >= 2) {
    try {
      const q = `${cName} 부산`;
      const url = `https://search.naver.com/search.naver?query=${encodeURIComponent(q)}`;
      const res = await fetchWithTimeout(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      }, 3500);
      const text = await res.text();
      const distMatch = t.address.match(/([가-힣]+[구군])/);
      const dist = distMatch ? distMatch[1] : '부산';
      if (text.includes(cName) && (text.includes(dist) || text.includes('부산'))) {
        const matches = text.match(/(?:051|02|070|010|0507|15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{3,4}-[0-9]{4}|(?:15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}/g);
        if (matches) {
          for (const m of matches) {
            const cp = cleanPhone(m);
            if (cp) {
              found = cp;
              source = 'Naver-Local';
              break;
            }
          }
        }
      }
    } catch (e) {}
  }

  const resObj = {
    seq: t.seq,
    name: t.name,
    ceo: t.ceo,
    bno: t.bno,
    phone: found,
    source
  };

  results[t.bno] = resObj;
  return resObj;
}

async function runBatch() {
  console.log(`Starting relaxed batch scan for ${targets.length} targets...`);
  console.log(`Already scanned: ${Object.keys(results).length}`);

  const CONCURRENCY = 6;
  let running = 0;
  let idx = 0;
  let foundTotal = Object.values(results).filter(r => r.phone).length;
  let lastSave = Date.now();

  return new Promise((resolve) => {
    function next() {
      if (idx >= targets.length && running === 0) {
        fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');
        console.log(`\n=== Batch Scan Completed! ===`);
        console.log(`Total scanned: ${Object.keys(results).length}`);
        console.log(`Total phone numbers found: ${foundTotal}`);
        return resolve();
      }

      while (running < CONCURRENCY && idx < targets.length) {
        const target = targets[idx++];
        running++;

        scanOne(target).then((res) => {
          running--;
          if (res.phone) {
            foundTotal++;
            console.log(`[FOUND ${foundTotal}] Seq ${res.seq} ${res.name} -> ${res.phone} (${res.source})`);
          }

          if (Date.now() - lastSave > 10000) {
            fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');
            lastSave = Date.now();
            console.log(`[Progress] Scanned ${idx}/${targets.length} (${(idx/targets.length*100).toFixed(1)}%), Found: ${foundTotal}`);
          }

          next();
        }).catch((err) => {
          running--;
          next();
        });
      }
    }

    next();
  });
}

runBatch();
