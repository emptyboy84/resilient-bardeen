const fs = require('fs');
const https = require('https');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const unpopulatedFile = path.join(SCRATCH_DIR, 'unpopulated_271.json');
const unpopulated = JSON.parse(fs.readFileSync(unpopulatedFile, 'utf8'));

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function searchBizno(q) {
  if (!q || q.trim().length < 2) return [];
  const url = `https://bizno.net/?query=${encodeURIComponent(q.trim())}`;
  const html = await fetchUrl(url);
  const regex = /<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const results = [];
  const seen = new Set();
  while ((match = regex.exec(html)) !== null) {
    const biznoRaw = match[1];
    if (!seen.has(biznoRaw)) {
      seen.add(biznoRaw);
      const title = match[2].replace(/<[^>]+>/g, '').trim();
      results.push({ bizno: biznoRaw, title });
    }
  }
  return results;
}

async function getArticleDetails(bizno) {
  const url = `https://bizno.net/article/${bizno}`;
  const html = await fetchUrl(url);
  if (!html) return null;
  
  const mMeta = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const metaDesc = mMeta ? mMeta[1] : '';
  
  // Parse fields
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
  
  // Table fallback if meta lacks fields
  if (!rep) {
    const tRep = html.match(/대표자명<\/t[dh]>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
    if (tRep) rep = tRep[1].replace(/<[^>]+>/g, '').trim();
  }
  if (!addr) {
    const tAddr = html.match(/회사주소<\/t[dh]>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
    if (tAddr) addr = tAddr[1].replace(/<[^>]+>/g, '').trim();
  }
  if (!tel) {
    const tTel = html.match(/전화번호<\/t[dh]>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
    if (tTel) tel = tTel[1].replace(/<[^>]+>/g, '').trim();
  }
  if (!emp) {
    const tEmp = html.match(/종업원수<\/t[dh]>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
    if (tEmp) {
      const eMatch = tEmp[1].replace(/<[^>]+>/g, '').trim().match(/(\d+)/);
      if (eMatch) emp = eMatch[1];
    }
  }
  if (!estDate) {
    const tEst = html.match(/(?:설립일|등록일)<\/t[dh]>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
    if (tEst) estDate = tEst[1].replace(/<[^>]+>/g, '').trim();
  }
  
  return { bizno, rep, addr, tel, fax, estDate, emp, status, closeDate, url };
}

function normalize(str) {
  if (!str) return '';
  return str.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
}

function isBusanAddress(addr) {
  if (!addr) return false;
  return addr.includes('부산') || /강서구|금정구|기장군|남구|동구|동래구|부산진구|북구|사상구|사하구|서구|수영구|연제구|영도구|중구|해운대구/.test(addr);
}

function verifyMatch(target, details, candidateTitle) {
  if (!details) return { matched: false };
  
  // 1. Must be in Busan (target address or candidate address)
  const candidateIsBusan = isBusanAddress(details.addr);
  const targetIsBusan = isBusanAddress(target.address);
  
  // If candidate address is clearly outside Busan (e.g. 서울, 경기, 대전, etc.) and not Busan -> reject
  if (details.addr && !candidateIsBusan && details.addr.length > 5) {
    return { matched: false, reason: 'Outside Busan: ' + details.addr };
  }
  
  let score = 0;
  let reasons = [];
  
  // Check Company Name
  const targetNorm = normalize(target.name);
  const candTitleNorm = normalize(candidateTitle);
  if (targetNorm && candTitleNorm && (targetNorm === candTitleNorm || candTitleNorm.includes(targetNorm) || targetNorm.includes(candTitleNorm))) {
    score += 2;
    reasons.push('Name match');
  }
  
  // Check CEO
  if (target.ceo && details.rep) {
    const tCeoNorm = normalize(target.ceo);
    const cCeoNorm = normalize(details.rep);
    if (tCeoNorm === cCeoNorm || cCeoNorm.includes(tCeoNorm) || tCeoNorm.includes(cCeoNorm)) {
      score += 3;
      reasons.push(`CEO match (${details.rep})`);
    }
  }
  
  // Check Phone
  if (target.phone && details.tel) {
    const tPhone = target.phone.replace(/[^0-9]/g, '');
    const cPhone = details.tel.replace(/[^0-9]/g, '');
    if (tPhone && cPhone && (tPhone === cPhone || tPhone.endsWith(cPhone) || cPhone.endsWith(tPhone))) {
      score += 3;
      reasons.push(`Phone match (${details.tel})`);
    }
  }
  
  // Check Address / District
  if (details.addr) {
    if (candidateIsBusan) {
      score += 1;
      reasons.push('Busan location');
    }
    if (target.gu && details.addr.includes(target.gu)) {
      score += 2;
      reasons.push(`District match (${target.gu})`);
    }
    // Check street/dong match
    if (target.address) {
      const targetWords = target.address.split(/\s+/).filter(w => w.length >= 2 && !['부산', '부산시', '부산광역시'].includes(w));
      let wordMatches = 0;
      for (const w of targetWords) {
        if (details.addr.includes(w)) wordMatches++;
      }
      if (wordMatches >= 2) {
        score += 2;
        reasons.push(`Address words match (${wordMatches} words)`);
      }
    }
  }
  
  // Strict matching rule:
  // Must have score >= 4 (e.g. Name + CEO, or Name + District + Busan, or Name + Phone, or CEO + District + Busan)
  // If target has CEO, matching CEO is strongly preferred unless Name + Address exact.
  if (score >= 4) {
    return { matched: true, score, reasons: reasons.join(', ') };
  }
  return { matched: false, score, reasons: reasons.join(', ') };
}

async function runDeepSearch() {
  console.log(`Starting deep search on ${unpopulated.length} unpopulated companies...`);
  
  const found = [];
  let checkedCount = 0;
  
  for (const comp of unpopulated) {
    checkedCount++;
    const progress = `[${checkedCount}/${unpopulated.length}]`;
    const cleanName = comp.name.replace(/\(주\)|주식회사|\(유\)|유한회사/g, '').trim();
    
    // Search queries to try
    const queries = [comp.name];
    if (cleanName !== comp.name) queries.push(cleanName);
    if (comp.name.includes(' ')) queries.push(comp.name.replace(/\s+/g, ''));
    if (comp.ceo && cleanName.length >= 2) queries.push(`${cleanName} ${comp.ceo}`);
    
    let matchedCandidate = null;
    let matchDetails = null;
    let matchReason = '';
    
    for (const q of queries) {
      if (matchedCandidate) break;
      const candidates = await searchBizno(q);
      await sleep(150);
      
      for (const cand of candidates.slice(0, 5)) {
        if (!isValidBizNo(cand.bizno)) continue;
        const details = await getArticleDetails(cand.bizno);
        await sleep(150);
        
        const evalRes = verifyMatch(comp, details, cand.title);
        if (evalRes.matched) {
          matchedCandidate = cand;
          matchDetails = details;
          matchReason = evalRes.reasons;
          break;
        }
      }
    }
    
    if (matchedCandidate && matchDetails) {
      console.log(`\x1b[32m${progress} FOUND: Row ${comp.rowNumber} [${comp.name}] -> BizNo: ${formatBizNo(matchedCandidate.bizno)} | Score: ${matchReason}\x1b[0m`);
      found.push({
        rowNumber: comp.rowNumber,
        seq: comp.seq,
        name: comp.name,
        bizno: formatBizNo(matchedCandidate.bizno),
        cleanBizno: matchedCandidate.bizno,
        targetCeo: comp.ceo,
        foundCeo: matchDetails.rep,
        targetAddr: comp.address,
        foundAddr: matchDetails.addr,
        targetPhone: comp.phone,
        foundPhone: matchDetails.tel,
        foundFax: matchDetails.fax,
        estDate: matchDetails.estDate,
        emp: matchDetails.emp,
        status: matchDetails.status,
        closeDate: matchDetails.closeDate,
        source: matchDetails.url,
        matchReason: matchReason
      });
    } else {
      // Not found
      if (checkedCount % 20 === 0) {
        console.log(`${progress} Checked ${checkedCount}, currently found ${found.length} new matches.`);
      }
    }
  }
  
  console.log(`\n=== DEEP SEARCH COMPLETE ===`);
  console.log(`Total newly found: ${found.length} out of ${unpopulated.length}`);
  fs.writeFileSync(path.join(SCRATCH_DIR, 'newly_found_pass1.json'), JSON.stringify(found, null, 2), 'utf8');
}

runDeepSearch();
