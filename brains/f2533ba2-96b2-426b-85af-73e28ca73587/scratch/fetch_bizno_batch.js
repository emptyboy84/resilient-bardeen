const fs = require('fs');

const lines = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/f2533ba2-96b2-426b-85af-73e28ca73587/scratch/input_batch.tsv', 'utf-8')
  .split('\n')
  .filter(l => l.trim().length > 0);

function getBizType(bizno) {
  const clean = (bizno || '').replace(/[^0-9]/g, '');
  if (clean.length !== 10) return 'UNKNOWN';
  const mid = clean.substring(3, 5);
  const midNum = Number(mid);
  if ((midNum >= 1 && midNum <= 79) || (midNum >= 90 && midNum <= 99)) return '개인사업자';
  if (['81', '86', '87', '88'].includes(mid)) return '영리법인본점';
  if (mid === '85') return '영리법인지점';
  if (mid === '82') return '비영리법인';
  return '기타';
}

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

const corps = [];
lines.forEach((line, idx) => {
  const p = line.split('\t');
  const company = (p[2] || '').trim();
  const bizno = (p[3] || '').trim();
  const rep = (p[4] || '').trim();
  const corpNoInRow = (p[13] || '').trim();
  const bizType = getBizType(bizno);
  const isCorp = ['영리법인본점', '영리법인지점', '비영리법인'].includes(bizType) ||
                 company.includes('(주)') || company.includes('주식회사') || company.includes('㈜') || company.includes('법인');

  if (isCorp) {
    corps.push({
      rowNo: idx + 1,
      company,
      bizno,
      rep,
      bizType,
      existingCorpNo: corpNoInRow,
    });
  }
});

console.log(`Starting crawl for ${corps.length} corporate entities...`);

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function fetchBizno(bizno) {
  const clean = bizno.replace(/[^0-9]/g, '');
  const url = `https://bizno.net/article/${clean}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    if (!res.ok) return { status: res.status, corpNo: null };
    const html = await res.text();
    
    // Check for og:description or specific meta tags where bizno puts: "법인등록번호 : 131111-0605021"
    const metaMatch = html.match(/법인등록번호\s*:\s*([0-9]{6}-[0-9]{7})/);
    if (metaMatch) {
      return { status: 200, corpNo: metaMatch[1] };
    }
    
    // Check in table rows
    const tableMatch = html.match(/법인(?:등록)?번호<\/t[dh]>[\s\S]*?<t[dh][^>]*>\s*([0-9]{6}-[0-9]{7})/i);
    if (tableMatch) {
      return { status: 200, corpNo: tableMatch[1] };
    }

    // Generic match
    const generalMatches = html.match(/[0-9]{6}-[0-9]{7}/g);
    if (generalMatches) {
      for (const m of generalMatches) {
        if (isValidCorpNo(m)) {
          return { status: 200, corpNo: m };
        }
      }
    }
    return { status: 200, corpNo: null, htmlSample: html.substring(0, 500) };
  } catch (err) {
    return { status: 'ERROR', error: err.message, corpNo: null };
  }
}

async function run() {
  const results = [];
  for (let i = 0; i < corps.length; i++) {
    const item = corps[i];
    if (item.existingCorpNo && isValidCorpNo(item.existingCorpNo)) {
      results.push({
        ...item,
        foundCorpNo: item.existingCorpNo,
        source: '기존 기재',
        valid: true
      });
      console.log(`[${i + 1}/${corps.length}] (Row ${item.rowNo}) ${item.company} -> 기존기재: ${item.existingCorpNo} ✅`);
      continue;
    }

    const res = await fetchBizno(item.bizno);
    const valid = isValidCorpNo(res.corpNo);
    results.push({
      ...item,
      foundCorpNo: res.corpNo,
      source: res.corpNo ? '비즈노(bizno.net)' : '미발견',
      valid
    });

    console.log(`[${i + 1}/${corps.length}] (Row ${item.rowNo}) ${item.company} (${item.bizno}) -> ${res.corpNo || '없음'} ${valid ? '✅' : (res.corpNo ? '⚠️' : '❌')}`);
    await sleep(250);
  }

  fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/f2533ba2-96b2-426b-85af-73e28ca73587/scratch/corps_found_results.json', JSON.stringify(results, null, 2), 'utf-8');
  console.log('\n--- 완료 요약 ---');
  const found = results.filter(r => r.foundCorpNo && r.valid);
  console.log(`총 법인: ${corps.length}개 중 찾은 법인번호: ${found.length}개`);
}

run();
