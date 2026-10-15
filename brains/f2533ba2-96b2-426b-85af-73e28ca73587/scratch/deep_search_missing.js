const fs = require('fs');

const rawResults = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/f2533ba2-96b2-426b-85af-73e28ca73587/scratch/corps_found_results.json', 'utf-8'));

function isValidCorpNo(corpNo) {
  if (!corpNo) return false;
  const clean = corpNo.replace(/[^0-9]/g, '');
  if (clean.length !== 13) return false;
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(clean[i]) * weights[i];
  }
  const remainder = sum % 10;
  const checkDigit = (10 - remainder) % 10;
  return Number(clean[12]) === checkDigit;
}

const missing = rawResults.filter(r => !r.foundCorpNo || !r.valid);
console.log('Missing count:', missing.length);

async function searchBiznoByName(company, rep) {
  // Clean company name: remove (주), ㈜, 주식회사, 지점, 공장
  const cleanName = company.replace(/\(주\)|㈜|주식회사|지점|부산공장|기장공장/g, '').trim();
  const url = 'https://bizno.net/?query=' + encodeURIComponent(cleanName);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    const html = await res.text();
    const articleLinks = html.match(/\/article\/[0-9]+/g);
    if (!articleLinks) return null;
    
    // Check up to 3 links
    const uniqueLinks = Array.from(new Set(articleLinks)).slice(0, 3);
    for (const link of uniqueLinks) {
      const artRes = await fetch('https://bizno.net' + link, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!artRes.ok) continue;
      const artHtml = await artRes.text();
      // Check if representative matches or address matches
      const hasRep = rep && artHtml.includes(rep);
      const m = artHtml.match(/[0-9]{6}-[0-9]{7}/g);
      if (m) {
        for (const c of m) {
          if (isValidCorpNo(c)) {
            return { corpNo: c, matchedLink: link, repMatch: !!hasRep };
          }
        }
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function run() {
  const deepResults = [];
  for (const m of missing) {
    console.log(`Deep searching: ${m.company} (${m.bizno}, rep: ${m.rep})...`);
    const found = await searchBiznoByName(m.company, m.rep);
    if (found) {
      console.log(`  -> Found ${found.corpNo} (repMatch: ${found.repMatch}, link: ${found.matchedLink})`);
      deepResults.push({ ...m, foundCorpNo: found.corpNo, repMatch: found.repMatch, link: found.matchedLink });
    } else {
      console.log(`  -> Not found`);
      deepResults.push({ ...m, foundCorpNo: null });
    }
    await new Promise(r => setTimeout(r, 400));
  }
  fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/f2533ba2-96b2-426b-85af-73e28ca73587/scratch/deep_missing_results.json', JSON.stringify(deepResults, null, 2), 'utf-8');
}

run();
