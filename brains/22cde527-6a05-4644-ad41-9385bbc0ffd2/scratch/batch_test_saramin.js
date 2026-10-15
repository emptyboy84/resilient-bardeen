const fs = require('fs');
const path = require('path');
const https = require('https');

const SCRATCH = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const masterList = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'master_verified_194.json'), 'utf8'));

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
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', err => resolve({ status: 500, error: err.message }));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ status: 408, error: 'timeout' });
    });
  });
}

function parseRevenue(text) {
  if (!text) return null;
  text = text.trim();
  // e.g. "60억 181만원", "192만원", "15억", "3,500만원"
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

async function searchCompany(item) {
  // Search query: try company name
  const query = item.name.replace(/\([^)]*\)/g, '').trim();
  const searchUrl = `https://www.saramin.co.kr/zf_user/search/company?searchword=${encodeURIComponent(query)}`;
  const searchRes = await fetchUrl(searchUrl);
  if (searchRes.status !== 200) return null;

  const items = searchRes.data.split('class="item_corp"');
  if (items.length <= 1) return null;

  // Evaluate top candidates (up to 3)
  for (let i = 1; i < Math.min(items.length, 4); i++) {
    const chunk = items[i].substring(0, 1500);
    const linkMatch = chunk.match(/href="([^"]+csn=[^"]+)"/);
    if (!linkMatch) continue;

    let detailUrl = linkMatch[1];
    if (!detailUrl.startsWith('http')) {
      detailUrl = 'https://www.saramin.co.kr' + detailUrl;
    }

    const detailRes = await fetchUrl(detailUrl);
    if (detailRes.status !== 200) continue;

    const html = detailRes.data;

    // Check match criteria: CEO name or Busan address
    let isMatch = false;
    let matchReason = '';

    if (item.ceo && item.ceo.length >= 2 && html.includes(item.ceo)) {
      isMatch = true;
      matchReason += `대표자 일치(${item.ceo}) `;
    }

    // Check address or region
    if (html.includes('부산')) {
      if (item.address) {
        // Check district
        const guMatch = item.address.match(/([가-힣]+[구|군])/);
        if (guMatch && html.includes(guMatch[1])) {
          isMatch = true;
          matchReason += `지역 일치(부산 ${guMatch[1]}) `;
        }
      }
    }

    // If neither CEO nor region matched, do NOT accept
    if (!isMatch) continue;

    // Extract revenue
    const summaryRegex = /<strong class="company_summary_tit">\s*([^<]+)\s*<\/strong>[\s\S]*?<p class="company_summary_desc">\s*매출액\s*<\/p>/;
    const revMatch = html.match(summaryRegex);

    // Also extract employee count, industry, est date if available
    const empRegex = /<strong class="company_summary_tit">\s*([^<]+)\s*<\/strong>[\s\S]*?<p class="company_summary_desc">\s*사원수\s*<\/p>/;
    const empMatch = html.match(empRegex);

    if (revMatch) {
      const parsed = parseRevenue(revMatch[1]);
      return {
        row: item.rowNumber,
        name: item.name,
        bizno: item.bizno,
        ceo: item.ceo,
        matchReason: matchReason.trim(),
        saraminUrl: detailUrl,
        rawRevenue: revMatch[1].trim(),
        won: parsed ? parsed.won : null,
        formattedWon: parsed ? parsed.formattedWon : revMatch[1].trim(),
        emp: empMatch ? empMatch[1].trim() : null
      };
    } else {
      return {
        row: item.rowNumber,
        name: item.name,
        bizno: item.bizno,
        ceo: item.ceo,
        matchReason: matchReason.trim() + ' (매출액 비공개/미기재)',
        saraminUrl: detailUrl,
        rawRevenue: null,
        won: null,
        formattedWon: null,
        emp: empMatch ? empMatch[1].trim() : null
      };
    }
  }

  return null;
}

async function run() {
  console.log('Testing first 25 companies from masterList...');
  const sample = masterList.slice(0, 25);
  const results = [];

  for (let i = 0; i < sample.length; i++) {
    const item = sample[i];
    process.stdout.write(`[${i + 1}/${sample.length}] ${item.rowNumber} ${item.name}... `);
    const res = await searchCompany(item);
    if (res) {
      if (res.won) {
        console.log(`FOUND REVENUE! ${res.rawRevenue} (${res.formattedWon}원) - ${res.matchReason}`);
        results.push(res);
      } else {
        console.log(`Matched on Saramin but no revenue - ${res.matchReason}`);
        results.push(res);
      }
    } else {
      console.log('Not found on Saramin');
    }
    // Small delay to be polite
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Checked: ${sample.length}`);
  console.log(`Found with revenue: ${results.filter(r => r.won).length}`);
  console.log(JSON.stringify(results.filter(r => r.won), null, 2));
}

run();
