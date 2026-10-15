const fs = require('fs');
const https = require('https');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const unpopulated = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'unpopulated_271.json'), 'utf8'));

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

function formatBizNo(b) {
  const clean = b.replace(/[^0-9]/g, '');
  return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`;
}

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      },
      timeout: 8000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

function normalize(str) {
  if (!str) return '';
  return str.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
}

function isBusanAddress(addr) {
  if (!addr) return false;
  return addr.includes('부산') || /강서구|금정구|기장군|남구|동구|동래구|부산진구|북구|사상구|사하구|서구|수영구|연제구|영도구|중구|해운대구/.test(addr);
}

async function searchBiznoDirect(query) {
  const url = `https://bizno.net/?query=${encodeURIComponent(query)}`;
  const html = await fetchUrl(url);
  if (!html) return [];
  
  // Only extract results if search actually succeeded and wasn't an empty recommendation
  // On bizno, search results are inside <table class="table ..."> or <div class="titles">
  // Specifically: <a href="/article/XXXXXXXXXX"><b>COMPANY_NAME</b></a>
  const regex = /<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const results = [];
  const seen = new Set();
  
  while ((match = regex.exec(html)) !== null) {
    const biznoRaw = match[1];
    if (seen.has(biznoRaw)) continue;
    seen.add(biznoRaw);
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    results.push({ bizno: biznoRaw, title: text });
  }
  return results;
}

async function fetchArticle(bizno) {
  const url = `https://bizno.net/article/${bizno}`;
  const html = await fetchUrl(url);
  if (!html) return null;
  
  const mMeta = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const metaDesc = mMeta ? mMeta[1] : '';
  
  let rep = '';
  let addr = '';
  let tel = '';
  let fax = '';
  let estDate = '';
  let emp = '';
  let status = '계속사업자';
  let closeDate = '';
  
  const mRep = metaDesc.match(/대표자명\s*:\s*([^;]+?)(?=\s+(?:전화번호|회사주소|종업원수|과세유형|사업자등록번호|$))/i);
  if (mRep) rep = mRep[1].trim();
  
  const mAddr = metaDesc.match(/회사주소\s*:\s*([^;]+?)(?=\s+(?:종업원수|과세유형|사업자등록번호|전화번호|$))/i);
  if (mAddr) addr = mAddr[1].trim();
  
  const mTel = metaDesc.match(/전화번호\s*:\s*([^;]+?)(?=\s+(?:팩스번호|회사주소|대표자명|종업원수|$))/i);
  if (mTel) tel = mTel[1].trim();
  
  const mFax = metaDesc.match(/팩스번호\s*:\s*([^;]+?)(?=\s+(?:회사주소|대표자명|종업원수|과세유형|$))/i);
  if (mFax) fax = mFax[1].trim();
  
  const mEst = metaDesc.match(/설립일\(신고\/인허가일\)\s*:\s*([^;]+?)(?=\s+(?:대표자명|전화번호|회사주소|$))/i);
  if (mEst) estDate = mEst[1].trim();
  
  const mEmp = metaDesc.match(/종업원수\s*:\s*(\d+)명/i);
  if (mEmp) emp = mEmp[1].trim();
  
  if (metaDesc.includes('폐업') || html.includes('폐업')) {
    status = '폐업자';
    const mClose = html.match(/폐업일자\s*[:：]?\s*(\d{4}[-.]\d{2}[-.]\d{2})/i) || html.match(/(\d{4}[-.]\d{2}[-.]\d{2})\s*폐업/i);
    if (mClose) closeDate = mClose[1].replace(/\./g, '-');
  }
  
  return { bizno, rep, addr, tel, fax, estDate, emp, status, closeDate, url };
}

async function processCompany(comp) {
  const normTargetName = normalize(comp.name);
  if (!normTargetName) return null;
  
  // Try search by name
  const candidates = await searchBiznoDirect(comp.name);
  
  for (const cand of candidates) {
    if (!isValidBizNo(cand.bizno)) continue;
    const candNorm = normalize(cand.title);
    
    // Strict title match check
    const isNameMatch = candNorm === normTargetName || 
                        candNorm.includes(normTargetName) || 
                        normTargetName.includes(candNorm);
    if (!isNameMatch) continue;
    
    // Fetch details to verify location and identity
    const details = await fetchArticle(cand.bizno);
    if (!details) continue;
    
    // Check location
    const inBusan = isBusanAddress(details.addr);
    if (details.addr && !inBusan && details.addr.length > 5) {
      // Outside Busan -> discard
      continue;
    }
    
    // Check match criteria:
    // 1. CEO match
    let ceoMatch = false;
    if (comp.ceo && details.rep) {
      const tc = normalize(comp.ceo);
      const dc = normalize(details.rep);
      if (tc === dc || dc.includes(tc) || tc.includes(dc)) ceoMatch = true;
    }
    
    // 2. Phone match
    let phoneMatch = false;
    if (comp.phone && details.tel) {
      const tp = comp.phone.replace(/[^0-9]/g, '');
      const dp = details.tel.replace(/[^0-9]/g, '');
      if (tp && dp && (tp === dp || tp.endsWith(dp) || dp.endsWith(tp))) phoneMatch = true;
    }
    
    // 3. Address match
    let addrMatch = false;
    if (details.addr && inBusan) {
      if (comp.gu && details.addr.includes(comp.gu)) addrMatch = true;
      if (comp.address) {
        const words = comp.address.split(/\s+/).filter(w => w.length >= 2 && !['부산', '부산시', '부산광역시'].includes(w));
        for (const w of words) {
          if (details.addr.includes(w)) { addrMatch = true; break; }
        }
      }
    }
    
    // Verification judgment:
    // If target has CEO: CEO match OR (Phone match AND inBusan) OR (Exact name match AND Addr match)
    // If target has no CEO: inBusan AND (Phone match OR Addr match OR (Exact name match AND details.addr contains 부산))
    let verified = false;
    let matchType = '';
    
    if (ceoMatch) {
      verified = true;
      matchType = '상호 및 대표자(' + details.rep + ') 일치';
    } else if (phoneMatch && inBusan) {
      verified = true;
      matchType = '상호 및 유선전화(' + details.tel + ') 일치';
    } else if (addrMatch && inBusan) {
      verified = true;
      matchType = '상호 및 부산 주소(' + details.addr + ') 일치';
    } else if (candNorm === normTargetName && inBusan) {
      verified = true;
      matchType = '정확한 상호명 및 부산 소재지 일치';
    }
    
    if (verified) {
      return {
        rowNumber: comp.rowNumber,
        seq: comp.seq,
        name: comp.name,
        bizno: formatBizNo(cand.bizno),
        cleanBizno: cand.bizno,
        targetCeo: comp.ceo,
        foundCeo: details.rep,
        targetAddr: comp.address,
        foundAddr: details.addr,
        targetPhone: comp.phone,
        foundPhone: details.tel,
        foundFax: details.fax,
        estDate: details.estDate,
        emp: details.emp,
        status: details.status,
        closeDate: details.closeDate,
        source: details.url,
        matchType: matchType
      };
    }
  }
  return null;
}

// Concurrency pool runner
async function runPool(items, concurrency, workerFn) {
  const results = [];
  let index = 0;
  
  async function worker() {
    while (index < items.length) {
      const i = index++;
      const item = items[i];
      try {
        const res = await workerFn(item);
        if (res) {
          results.push(res);
          console.log(`[FOUND ${results.length}] Row ${res.rowNumber}: ${res.name} -> ${res.bizno} (${res.matchType})`);
        }
      } catch (err) {}
      if (i % 25 === 0) {
        console.log(`Progress: ${i + 1}/${items.length} completed...`);
      }
    }
  }
  
  const workers = [];
  for (let c = 0; c < concurrency; c++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log(`Starting high-speed parallel search for ${unpopulated.length} companies with concurrency 12...`);
  const startTime = Date.now();
  const matched = await runPool(unpopulated, 12, processCompany);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log(`\nFinished in ${elapsed}s. Total newly verified companies: ${matched.length}`);
  fs.writeFileSync(path.join(SCRATCH_DIR, 'newly_verified_pass1.json'), JSON.stringify(matched, null, 2), 'utf8');
}

main();
