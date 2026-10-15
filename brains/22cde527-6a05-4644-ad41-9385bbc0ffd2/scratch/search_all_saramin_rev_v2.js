const fs = require('fs');
const path = require('path');
const https = require('https');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterFile = path.join(SCRATCH, 'master_verified_194.json');
const masterList = JSON.parse(fs.readFileSync(masterFile, 'utf8'));

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'Referer': 'https://www.saramin.co.kr/'
      }
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: d }));
    });
    req.on('error', err => resolve({ status: 500, error: err.message, data: '' }));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ status: 408, error: 'timeout', data: '' });
    });
  });
}

function parseRevenue(text) {
  if (!text) return null;
  text = text.trim();
  let totalWon = 0;
  const eokMatch = text.match(/([\d,.]+)\s*억/);
  const manMatch = text.match(/([\d,.]+)\s*만\s*원?/);
  const wonMatch = text.match(/([\d,]+)\s*원/);

  if (eokMatch) {
    const eokVal = parseFloat(eokMatch[1].replace(/,/g, ''));
    totalWon += eokVal * 100000000;
  }
  if (manMatch) {
    const manVal = parseFloat(manMatch[1].replace(/,/g, ''));
    totalWon += manVal * 10000;
  }
  if (!eokMatch && !manMatch && wonMatch) {
    totalWon += parseInt(wonMatch[1].replace(/,/g, ''), 10);
  }

  if (totalWon > 0) {
    return {
      rawText: text,
      won: totalWon,
      formattedWon: totalWon.toLocaleString('ko-KR')
    };
  }
  return { rawText: text, won: null, formattedWon: text };
}

function cleanCompanyName(name) {
  return name
    .replace(/\([^)]*\)/g, '')
    .replace(/주식회사|\(주\)|\(유\)|유한회사|사단법인|합자회사|합명회사/g, '')
    .replace(/(롯데동래점|사직동지점|수정중앙지국|센텀점|서면점|부산점)/g, '')
    .trim();
}

async function searchSaraminForCompany(item) {
  const cleanName = cleanCompanyName(item.name);
  if (!cleanName || cleanName.length < 2) return null;

  const searchUrl = `https://www.saramin.co.kr/zf_user/search/company?searchword=${encodeURIComponent(cleanName)}`;
  const searchRes = await fetchUrl(searchUrl);
  if (searchRes.status !== 200 || !searchRes.data) return null;

  const items = searchRes.data.split('class="item_corp"');
  if (items.length <= 1) return null;

  for (let i = 1; i < Math.min(items.length, 6); i++) {
    const chunk = items[i].substring(0, 2000);
    const linkMatch = chunk.match(/href="([^"]+csn=[^"]+)"/);
    if (!linkMatch) continue;

    let detailUrl = linkMatch[1];
    if (!detailUrl.startsWith('http')) detailUrl = 'https://www.saramin.co.kr' + detailUrl;

    const detailRes = await fetchUrl(detailUrl);
    if (detailRes.status !== 200 || !detailRes.data) continue;

    const html = detailRes.data;

    // Matching criteria
    let isMatch = false;
    let matchReasons = [];

    // 1. CEO match
    if (item.ceo && item.ceo.length >= 2 && html.includes(item.ceo)) {
      isMatch = true;
      matchReasons.push(`CEO(${item.ceo})`);
    }

    // 2. Address / District match
    if (html.includes('부산')) {
      if (item.address) {
        const guMatch = item.address.match(/([가-힣]+[구|군])/);
        if (guMatch && html.includes(guMatch[1])) {
          isMatch = true;
          matchReasons.push(`지역(부산 ${guMatch[1]})`);
        }
      }
    }

    // 3. Telephone match
    if (item.tel && item.tel.length >= 7) {
      const cleanTel = item.tel.replace(/[^0-9]/g, '');
      if (cleanTel.length >= 7 && html.replace(/[^0-9]/g, '').includes(cleanTel)) {
        isMatch = true;
        matchReasons.push(`전화(${item.tel})`);
      }
    }

    if (!isMatch) continue;

    // Extract summary items from <li> tags
    let rawRevenue = null;
    let rawEmp = null;
    let corpType = null;
    let estDate = null;

    const liList = html.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];
    for (let li of liList) {
      if (li.includes('company_summary_desc')) {
        const tit = (li.match(/<strong class="company_summary_tit">\s*([^<]+)\s*<\/strong>/) || [])[1];
        const desc = (li.match(/<p class="company_summary_desc">\s*([^<]+)\s*<\/p>/) || [])[1];
        if (tit && desc) {
          const d = desc.trim();
          const t = tit.trim();
          if (d === '매출액') rawRevenue = t;
          else if (d === '사원수') rawEmp = t;
          else if (d === '기업형태') corpType = t;
          else if (d.includes('설립')) estDate = d;
        }
      }
    }

    const result = {
      rowNumber: item.rowNumber,
      name: item.name,
      bizno: item.bizno,
      ceo: item.ceo,
      matchedName: (chunk.match(/title="([^"]+)"/) || [])[1] || cleanName,
      matchReason: matchReasons.join(', '),
      saraminUrl: detailUrl,
      rawEmp,
      corpType,
      estDate
    };

    if (rawRevenue) {
      const parsed = parseRevenue(rawRevenue);
      result.hasRevenue = true;
      result.rawRevenue = rawRevenue;
      result.won = parsed ? parsed.won : null;
      result.formattedWon = parsed ? parsed.formattedWon : rawRevenue;
    } else {
      result.hasRevenue = false;
      result.rawRevenue = null;
      result.won = null;
      result.formattedWon = null;
    }

    return result;
  }

  return null;
}

async function run() {
  console.log(`Starting precise revenue search for ${masterList.length} companies...`);
  const results = [];
  let foundRevCount = 0;
  let matchedCount = 0;

  for (let i = 0; i < masterList.length; i++) {
    const item = masterList[i];
    const res = await searchSaraminForCompany(item);
    if (res) {
      matchedCount++;
      if (res.hasRevenue) {
        foundRevCount++;
        console.log(`[${i + 1}/${masterList.length}] Row ${res.rowNumber} [${res.name}]: REVENUE = ${res.rawRevenue} (${res.formattedWon}원) [${res.matchReason}]`);
      }
      results.push(res);
    }
    await new Promise(r => setTimeout(r, 120));
  }

  console.log('\n========================================');
  console.log(`Finished search!`);
  console.log(`Total companies checked: ${masterList.length}`);
  console.log(`Matched on Saramin/NICE: ${matchedCount}`);
  console.log(`Companies with confirmed REVENUE: ${foundRevCount}`);

  const withRev = results.filter(r => r.hasRevenue);
  fs.writeFileSync(path.join(SCRATCH, 'revenue_found_saramin_v2.json'), JSON.stringify(withRev, null, 2), 'utf8');
  console.log(`Saved revenue results to ${path.join(SCRATCH, 'revenue_found_saramin_v2.json')}`);
}

run().catch(console.error);
