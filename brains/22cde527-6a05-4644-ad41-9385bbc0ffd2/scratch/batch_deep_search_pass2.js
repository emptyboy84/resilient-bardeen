const fs = require('fs');
const https = require('https');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const blanks = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'exact_blanks_229.json'), 'utf8'));

function isValidBizNo(b) {
  if (!b) return false;
  const clean = b.replace(/[^0-9]/g, '');
  if (clean.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(clean[i]) * weights[i];
  const d9 = Number(clean[8]) * 5;
  sum += Math.floor(d9 / 10) + (d9 % 10);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(clean[9]);
}

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      },
      timeout: 8000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function searchBiznoArticle(bizno) {
  const url = `https://bizno.net/article/${bizno.replace(/-/g, '')}`;
  const html = await fetchUrl(url);
  if (!html) return null;
  
  const mMeta = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const desc = mMeta ? mMeta[1] : '';
  
  let rep = '', addr = '', tel = '', estDate = '', emp = '', status = '계속사업자', closeDate = '';
  
  const mRep = desc.match(/대표자명\s*:\s*([^;]+?)(?=\s+(?:전화번호|회사주소|종업원수|과세유형|사업자등록번호|$))/i);
  if (mRep) rep = mRep[1].trim();
  
  const mAddr = desc.match(/회사주소\s*:\s*([^;]+?)(?=\s+(?:종업원수|과세유형|사업자등록번호|전화번호|$))/i);
  if (mAddr) addr = mAddr[1].trim();
  
  const mTel = desc.match(/전화번호\s*:\s*([^;]+?)(?=\s+(?:팩스번호|회사주소|대표자명|종업원수|$))/i);
  if (mTel) tel = mTel[1].trim();
  
  const mEst = desc.match(/설립일\(신고\/인허가일\)\s*:\s*([^;]+?)(?=\s+(?:대표자명|전화번호|회사주소|$))/i);
  if (mEst) estDate = mEst[1].trim();
  
  const mEmp = desc.match(/종업원수\s*:\s*(\d+)명/i);
  if (mEmp) emp = mEmp[1].trim();
  
  if (desc.includes('폐업') || html.includes('폐업')) {
    status = '폐업자';
    const mClose = html.match(/폐업일자\s*[:：]?\s*(\d{4}[-.]\d{2}[-.]\d{2})/i) || html.match(/(\d{4}[-.]\d{2}[-.]\d{2})\s*폐업/i);
    if (mClose) closeDate = mClose[1].replace(/\./g, '-');
  }
  
  return { rep, addr, tel, estDate, emp, status, closeDate, url };
}

async function searchNaverSnippet(q) {
  const url = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(q)}`;
  const html = await fetchUrl(url);
  if (!html) return [];
  
  const matches = html.match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
  const valid = [];
  for (const m of matches) {
    if (isValidBizNo(m) && !valid.includes(m)) valid.push(m);
  }
  return valid;
}

function normalize(s) {
  if (!s) return '';
  return s.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
}

async function processCompany(comp) {
  // Build 3 queries
  const queries = [];
  if (comp.name) {
    queries.push(`"${comp.name}" "사업자등록번호"`);
    if (comp.ceo) queries.push(`"${comp.name}" "${comp.ceo}"`);
    if (comp.phone) queries.push(`"${comp.name}" "${comp.phone}"`);
  }
  
  for (const q of queries) {
    const candidateBiznos = await searchNaverSnippet(q);
    for (const cand of candidateBiznos) {
      const details = await searchBiznoArticle(cand);
      if (!details) continue;
      
      // Check if location is Busan
      const inBusan = details.addr.includes('부산') || /강서구|금정구|기장군|남구|동구|동래구|부산진구|북구|사상구|사하구|서구|수영구|연제구|영도구|중구|해운대구/.test(details.addr);
      if (!inBusan) continue;
      
      // Check match:
      let verified = false;
      let reason = '';
      
      if (comp.ceo && details.rep && normalize(comp.ceo) === normalize(details.rep)) {
        verified = true;
        reason = `대표자 일치 (${details.rep})`;
      } else if (comp.phone && details.tel && comp.phone.replace(/\D/g, '') === details.tel.replace(/\D/g, '')) {
        verified = true;
        reason = `전화번호 일치 (${details.tel})`;
      } else if (comp.address && details.addr) {
        const words = comp.address.split(/\s+/).filter(w => w.length >= 2 && !['부산', '부산시', '부산광역시'].includes(w));
        let matchCount = 0;
        for (const w of words) {
          if (details.addr.includes(w)) matchCount++;
        }
        if (matchCount >= 2) {
          verified = true;
          reason = `주소 키워드 일치 (${matchCount}단어)`;
        }
      }
      
      if (verified) {
        return {
          rowNumber: comp.rowNumber,
          seq: comp.seq,
          name: comp.name,
          bizno: cand,
          cleanBizno: cand.replace(/-/g, ''),
          targetCeo: comp.ceo,
          foundCeo: details.rep,
          targetAddr: comp.address,
          foundAddr: details.addr,
          targetPhone: comp.phone,
          foundPhone: details.tel,
          estDate: details.estDate,
          emp: details.emp,
          status: details.status,
          closeDate: details.closeDate,
          source: details.url,
          strictProof: reason
        };
      }
    }
  }
  return null;
}

async function run() {
  console.log(`Deep searching ${blanks.length} blank companies...`);
  const found = [];
  
  // Run with concurrency 6
  let idx = 0;
  async function worker() {
    while (idx < blanks.length) {
      const i = idx++;
      const comp = blanks[i];
      try {
        const res = await processCompany(comp);
        if (res) {
          found.push(res);
          console.log(`[FOUND ${found.length}] Row ${res.rowNumber} [${res.name}] -> ${res.bizno} (${res.strictProof})`);
        }
      } catch (err) {}
      if (i % 25 === 0) {
        console.log(`Progress: ${i + 1}/${blanks.length} completed...`);
      }
    }
  }
  
  const workers = [];
  for (let c = 0; c < 6; c++) workers.push(worker());
  await Promise.all(workers);
  
  console.log(`\n=== PASS 2 DEEP SEARCH COMPLETE ===`);
  console.log(`Total new verified: ${found.length}`);
  fs.writeFileSync(path.join(SCRATCH_DIR, 'newly_found_pass2.json'), JSON.stringify(found, null, 2), 'utf8');
}

run();
