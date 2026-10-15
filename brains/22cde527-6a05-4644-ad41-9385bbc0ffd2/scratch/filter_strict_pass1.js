const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const candidates = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'newly_verified_pass1.json'), 'utf8'));

function isGenuineBusan(addr) {
  if (!addr) return false;
  // If it starts with other provinces/cities and doesn't mention Busan
  if (/^(?:서울|경기|인천|대구|광주|대전|울산|세종|강원|충북|충남|전북|전남|경북|경남)/.test(addr)) {
    if (!addr.includes('부산')) return false;
  }
  return addr.includes('부산') || /강서구|금정구|기장군|남구|동구|동래구|부산진구|북구|사상구|사하구|서구|수영구|연제구|영도구|중구|해운대구/.test(addr);
}

function normalize(s) {
  if (!s) return '';
  return s.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
}

const verified = [];
const rejected = [];

for (const cand of candidates) {
  const reasonList = [];
  let isGood = false;
  
  // 1. Location check
  if (!isGenuineBusan(cand.foundAddr)) {
    rejected.push({ row: cand.rowNumber, name: cand.name, reason: 'Outside Busan: ' + cand.foundAddr });
    continue;
  }
  
  // 2. CEO check
  let ceoMatch = false;
  if (cand.targetCeo && cand.foundCeo) {
    const t = normalize(cand.targetCeo);
    const f = normalize(cand.foundCeo);
    if (t === f || t.includes(f) || f.includes(t)) {
      ceoMatch = true;
      reasonList.push(`CEO 일치 (${cand.foundCeo})`);
    }
  }
  
  // 3. Phone check
  let phoneMatch = false;
  if (cand.targetPhone && cand.foundPhone) {
    const tp = cand.targetPhone.replace(/[^0-9]/g, '');
    const fp = cand.foundPhone.replace(/[^0-9]/g, '');
    if (tp && fp && (tp === fp || tp.endsWith(fp) || fp.endsWith(tp))) {
      phoneMatch = true;
      reasonList.push(`전화번호 일치 (${cand.foundPhone})`);
    }
  }
  
  // 4. Address check
  let addrMatch = false;
  if (cand.targetAddr && cand.foundAddr) {
    const tw = cand.targetAddr.split(/\s+/).filter(w => w.length >= 2 && !['부산', '부산시', '부산광역시'].includes(w));
    let matchWords = 0;
    for (const w of tw) {
      if (cand.foundAddr.includes(w)) matchWords++;
    }
    if (matchWords >= 1) {
      addrMatch = true;
      reasonList.push(`주소 키워드 일치 (${matchWords}개)`);
    }
  }
  
  // Strict acceptance criteria:
  // - If target has CEO: MUST match CEO OR (match Phone AND Busan) OR (match Address AND Busan)
  // - If target has no CEO, but has Phone: MUST match Phone AND Busan
  // - If target has no CEO, no Phone, but has Address: MUST match Address AND Busan
  // - If target had no CEO, no Phone, no Address: ONLY accept if name is unique/specific corporate name in Busan (e.g. 주식회사메쉬링크, 부산시대광고대행, 동아대학교출판부)
  
  if (cand.targetCeo) {
    if (ceoMatch) isGood = true;
    else if (phoneMatch && isGenuineBusan(cand.foundAddr)) isGood = true;
    else if (addrMatch && isGenuineBusan(cand.foundAddr)) isGood = true;
  } else if (cand.targetPhone) {
    if (phoneMatch && isGenuineBusan(cand.foundAddr)) isGood = true;
    else if (addrMatch && isGenuineBusan(cand.foundAddr)) isGood = true;
  } else if (cand.targetAddr) {
    if (addrMatch && isGenuineBusan(cand.foundAddr)) isGood = true;
  } else {
    // No target info except name
    const genericNames = ['나비', '니즈', '리연', '아이사랑', '인생극장', '즐겨찾기', '이안', '제로', '성원공업사', '영광화학', '두형통발', '모바일뱅크'];
    if (!genericNames.includes(cand.name) && cand.foundAddr && cand.foundAddr.includes('부산')) {
      isGood = true;
      reasonList.push('부산 고유 법인/상호명');
    }
  }
  
  if (isGood) {
    cand.strictProof = reasonList.join(' + ');
    verified.push(cand);
  } else {
    rejected.push({ row: cand.rowNumber, name: cand.name, reason: 'Insufficient proof / generic match' });
  }
}

console.log(`Audited ${candidates.length} candidates:`);
console.log(`Accepted strictly: ${verified.length}`);
console.log(`Rejected: ${rejected.length}`);

fs.writeFileSync(path.join(SCRATCH_DIR, 'strictly_verified_pass1.json'), JSON.stringify(verified, null, 2), 'utf8');
fs.writeFileSync(path.join(SCRATCH_DIR, 'rejected_pass1.json'), JSON.stringify(rejected, null, 2), 'utf8');
