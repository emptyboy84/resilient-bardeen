const fs = require('fs');

function cleanPhoneNumber(raw) {
  if (!raw) return null;
  let p = raw.trim();

  // Remove HTML tags
  p = p.replace(/<[^>]+>/g, '').trim();

  // Saramin format: +82 051-602-1700 or +82 51-602-1700 or +82 10-1234-5678
  p = p.replace(/^\+82\s*/, '');
  if (p.startsWith('51-')) p = '0' + p;
  if (p.startsWith('2-')) p = '0' + p;
  if (p.startsWith('10-')) p = '0' + p;
  if (p.startsWith('31-')) p = '0' + p;
  if (p.startsWith('70-')) p = '0' + p;

  // Clean prefixes like 02-1544, 051-1544, 02-1666, etc.
  const prefixMatch = p.match(/^(?:02|051|031)-(1[568][0-9]{2}-[0-9]{4})$/);
  if (prefixMatch) p = prefixMatch[1];

  // Saramin own CS numbers filter
  if (['02-6226-5000', '02-6937-0035', '02-6937-0039', '1577-0000'].includes(p)) {
    return null;
  }

  // 1. Masked 010: 010-xxxx-x***
  if (/^01[016789]-[0-9]{3,4}-[0-9*]{4}$/.test(p)) {
    return p;
  }

  // 2. Full phone
  const fullRegex = /^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|070|01[016789])-[0-9]{3,4}-[0-9]{4}$|^(15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$|^(050[0-9]?)-[0-9]{3,4}-[0-9]{4}$/;
  if (fullRegex.test(p)) {
    // Avoid bizNo pattern (3-2-5)
    if (/^[0-9]{3}-[0-9]{2}-[0-9]{5}$/.test(p)) return null;
    return p;
  }

  return null;
}

async function fetchSaramin(cleanBiz) {
  const url = 'https://www.saramin.co.kr/zf_user/company-info/view?csn=' + cleanBiz;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const jsonLdMatch = html.match(/"telephone":"\+82\s*([^"]+)"/);
    if (jsonLdMatch) {
      const cleaned = cleanPhoneNumber(jsonLdMatch[1]);
      if (cleaned) return cleaned;
    }
    const dtMatch = html.match(/<dt>전화<\/dt>\s*<dd>([^<]+)<\/dd>/);
    if (dtMatch) {
      const cleaned = cleanPhoneNumber(dtMatch[1]);
      if (cleaned) return cleaned;
    }
  } catch (e) {}
  return null;
}

async function fetchBizno(cleanBiz) {
  const url = 'https://bizno.net/article/' + cleanBiz;
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

      // Check for masked 010 first or full phone
      const rawText = inner.replace(/<[^>]+>/g, '').trim();
      const maskedMatch = rawText.match(/(01[016789]-[0-9]{3,4}-[0-9*]{4})/);
      if (maskedMatch) {
        const cleaned = cleanPhoneNumber(maskedMatch[1]);
        if (cleaned) return cleaned;
      }

      const telMatch = inner.match(/<a href=['"]tel:([^'"]+)['"]/) || inner.match(/([0-9]{2,4}-[0-9]{3,4}-[0-9]{4}|1[0-9]{3}-[0-9]{4})/);
      if (telMatch) {
        const cleaned = cleanPhoneNumber(telMatch[1]);
        if (cleaned) return cleaned;
      }
    }
  } catch (e) {}
  return null;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runDeepScan() {
  const targets = JSON.parse(fs.readFileSync('pure_missing_2658.json', 'utf8'));
  console.log(`Starting Deep Scan Stage 2 for ${targets.length} pure missing companies...`);

  let results = {};
  if (fs.existsSync('stage2_results.json')) {
    try {
      results = JSON.parse(fs.readFileSync('stage2_results.json', 'utf8'));
      console.log(`Loaded ${Object.keys(results).length} existing progress from stage2_results.json`);
    } catch(e) {}
  }

  const batchSize = 6;
  let newFoundCount = 0;
  let processedCount = 0;

  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);

    await Promise.all(batch.map(async (item) => {
      const cleanBiz = item.bizNo.replace(/[^0-9]/g, '');
      if (cleanBiz.length !== 10) return;
      if (results[cleanBiz]) return; // already processed

      // Query both platforms concurrently
      const [saraminPhone, biznoPhone] = await Promise.all([
        fetchSaramin(cleanBiz),
        fetchBizno(cleanBiz)
      ]);

      // Priority determination:
      // 1. Full unmasked phone (Saramin or Bizno unmasked)
      // 2. Bizno masked phone
      let chosenPhone = null;
      let source = null;

      if (saraminPhone && !saraminPhone.includes('*')) {
        chosenPhone = saraminPhone;
        source = 'Saramin';
      } else if (biznoPhone && !biznoPhone.includes('*')) {
        chosenPhone = biznoPhone;
        source = 'Bizno-Full';
      } else if (saraminPhone) {
        chosenPhone = saraminPhone;
        source = 'Saramin-Masked';
      } else if (biznoPhone) {
        chosenPhone = biznoPhone;
        source = 'Bizno-Masked';
      }

      if (chosenPhone) {
        results[cleanBiz] = {
          seq: item.seq,
          name: item.name,
          phone: chosenPhone,
          source: source
        };
        newFoundCount++;
        if (newFoundCount <= 20 || newFoundCount % 50 === 0) {
          console.log(`[FOUND ${newFoundCount}] Seq ${item.seq} ${item.name} -> ${chosenPhone} (${source})`);
        }
      }
      processedCount++;
    }));

    // Save checkpoint every 60 companies
    if (i % 60 === 0 || i + batchSize >= targets.length) {
      fs.writeFileSync('stage2_results.json', JSON.stringify(results, null, 2), 'utf8');
      console.log(`Progress: ${Math.min(i + batchSize, targets.length)} / ${targets.length} scanned | Found so far: ${newFoundCount}`);
    }

    await sleep(40);
  }

  fs.writeFileSync('stage2_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n=== Deep Scan Complete! ===`);
  console.log(`Total new phone numbers found in Stage 2: ${Object.keys(results).length} / ${targets.length}`);
}

runDeepScan();
