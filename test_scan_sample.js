const fs = require('fs');

const targets = JSON.parse(fs.readFileSync('missing_targets_phase2.json', 'utf8')).slice(0, 25);

const STRICT_PORTAL_CS_BLACKLIST = new Set([
  '02-6226-5000', '02-6937-0035', '02-6937-0039',
  '02-3771-1514', '1588-9356', '1588-3333',
  '1577-0000', '02-1577-0000', '02-2008-8888',
  '1588-0114', '114-114', '02-114'
]);

function cleanName(n) {
  return n.replace(/\(주\)/g, '').replace(/주식회사/g, '').replace(/\(유\)/g, '').replace(/유한회사/g, '').trim();
}

function cleanPhone(raw) {
  if (!raw) return null;
  const p = raw.trim();
  if (STRICT_PORTAL_CS_BLACKLIST.has(p)) return null;
  if (/^051-[0-9]{3}-(?:0200|2200|6200|7200|9200)$/.test(p)) return null;
  
  // Valid patterns
  if (/^(?:051|02|03[1-3]|04[1-4]|05[2-5]|06[1-4]|070|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}$|^(?:15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$/.test(p)) {
    return p;
  }
  if (/^01[016789]-[0-9]{3,4}-[0-9*]{4}$/.test(p)) {
    return p;
  }
  return null;
}

async function scanTarget(t) {
  const cName = cleanName(t.name);
  let found = null;
  let source = null;

  // 1. Bizno
  try {
    const res = await fetch(`https://bizno.net/article/${t.bno}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await res.text();
    const thMatch = text.match(/<th>전화번호<\/th>\s*<td>([^<]+)<\/td>/);
    if (thMatch) {
      const p = cleanPhone(thMatch[1]);
      if (p) {
        found = p;
        source = 'Bizno-Official';
      }
    }
  } catch(e) {}

  // 2. Daum Local Place
  if (!found && cName.length >= 2) {
    try {
      const q = `${cName} 부산`;
      const url = `https://search.daum.net/search?w=tot&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const text = await res.text();
      
      // Match phone if address snippet matches
      const district = t.address.match(/([가-힣]+[구군])/);
      const dist = district ? district[1] : '부산';
      if (text.includes(dist) || text.includes('부산')) {
        const pMatch = text.match(/(?:051|02|070|010|0507|15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{3,4}-[0-9]{4}|(?:15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}/);
        if (pMatch) {
          const cp = cleanPhone(pMatch[0]);
          if (cp) {
            found = cp;
            source = 'Daum-Place';
          }
        }
      }
    } catch(e) {}
  }

  return { seq: t.seq, name: t.name, ceo: t.ceo, phone: found, source };
}

async function runSample() {
  console.log(`Running sample scan on ${targets.length} targets...`);
  const results = [];
  for (const t of targets) {
    const r = await scanTarget(t);
    results.push(r);
    console.log(`Seq ${r.seq} [${r.name}] -> ${r.phone ? r.phone + ' (' + r.source + ')' : '(미등록)'}`);
    await new Promise(res => setTimeout(res, 200));
  }

  const foundCount = results.filter(r => r.phone).length;
  console.log(`\nSample result: ${foundCount}/${targets.length} (${(foundCount/targets.length*100).toFixed(1)}%) found!`);
}

runSample();
