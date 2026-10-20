const fs = require('fs');

const list = JSON.parse(fs.readFileSync('all_unfilled_masked.json', 'utf8')).slice(30, 60);

function isValidPhone(p) {
  if (!p) return false;
  if (p.includes('*')) return false;
  const regex = /^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|070|01[016789])-[0-9]{3,4}-[0-9]{4}$|^(15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$|^(050[0-9]?)-[0-9]{3,4}-[0-9]{4}$/;
  return regex.test(p);
}

async function searchDaum(query) {
  try {
    const url = `https://search.daum.net/search?w=tot&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) return '';
    return await res.text();
  } catch(e) { return ''; }
}

async function searchNaver(query) {
  try {
    const url = `https://m.search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)' }
    });
    if (!res.ok) return '';
    return await res.text();
  } catch(e) { return ''; }
}

async function run() {
  console.log(`Starting Batch 2 (${list.length} companies)...`);
  const results = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const cleanName = item.name.replace(/\(주\)|\(유\)|\(유책\)|\(합\)/g, '').trim();
    const prefix = item.legacyMaskedPhone ? item.legacyMaskedPhone.replace(/\*+/g, '') : '';

    console.log(`\n[${i + 31}/${i + 31}] Row ${item.row}: ${item.name} (대표: ${item.ceo}, 사업자: ${item.bno}, 마스킹: ${item.legacyMaskedPhone})`);

    let candidate = null;
    let source = null;

    // Query: cleanName + ceo
    const q1 = `${cleanName} ${item.ceo}`;
    const textDaum1 = await searchDaum(q1);
    const textNaver1 = await searchNaver(q1);
    const fullText1 = textDaum1 + ' ' + textNaver1;

    // Check unmasked 010 with prefix
    if (prefix && prefix.length >= 8) {
      const pRegex = new RegExp(`(${prefix.replace(/-/g, '[- ]?')}[0-9]{3,4})`, 'g');
      const m = fullText1.match(pRegex);
      if (m) {
        const matchedPhone = m[0].replace(/\s+/g, '-');
        if (isValidPhone(matchedPhone)) {
          candidate = matchedPhone;
          source = 'Portal-Unmask';
        }
      }
    }

    // Check landline / 070 / 15xx
    if (!candidate) {
      const phoneMatches = fullText1.match(/(?:051|070|02|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
      if (phoneMatches) {
        for (const p of phoneMatches) {
          if (isValidPhone(p) && !p.startsWith('02-120') && !p.startsWith('051-120')) {
            candidate = p;
            source = 'Portal-Landline';
            break;
          }
        }
      }
    }

    if (candidate) {
      console.log(`  >>> FOUND: ${candidate} (${source})`);
      results.push({ ...item, phone: candidate, source });
    } else {
      console.log(`  - No valid phone found. (Skip / Leave blank)`);
      results.push({ ...item, phone: null, source: 'NONE' });
    }

    await new Promise(r => setTimeout(r, 250));
  }

  fs.writeFileSync('batch2_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nBatch 2 completed! Found: ${results.filter(x => x.phone).length}/${list.length}`);
}

run();
