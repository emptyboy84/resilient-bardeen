const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';

// 1. Read verified_results
const verifiedResults = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'verified_results.json'), 'utf8'));

// 2. Read details_cache_150
const details150 = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'details_cache_150.json'), 'utf8'));

// 3. Read 43 newly verified
const list43 = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'all_newly_verified_43.json'), 'utf8'));

// 4. Add 엑스에이아이에듀랩스
list43.push({
  rowNumber: 2264,
  seq: '2263',
  name: '엑스에이아이에듀랩스',
  bizno: '729-86-02952',
  cleanBizno: '7298602952',
  targetCeo: '',
  foundCeo: '김동우',
  targetAddr: '부산진구 가야1동 467번지 창업빌리지 정보공학관 3층 307호 창업지원실',
  foundAddr: '부산광역시 해운대구 센텀북대로 60 1409호(재송동, 센텀아이에스타워)',
  targetPhone: '',
  foundPhone: '',
  foundFax: '',
  estDate: '2023-10-23',
  emp: '2',
  status: '폐업자',
  closeDate: '',
  source: 'https://bizno.net/article/7298602952',
  strictProof: '부산진구 통신판매신고(2024-부산진-1306) + 부산지법 법인등기(180111-1526251)'
});

const masterMap = {};

// Add the 150 companies
for (const [rowStr, det] of Object.entries(details150)) {
  const r = parseInt(rowStr, 10);
  const v = verifiedResults[rowStr] || {};
  const bizno = v.bizno || '';
  const cleanBizno = bizno.replace(/[^0-9]/g, '');
  
  masterMap[r] = {
    rowNumber: r,
    name: v.name || '',
    bizno: bizno,
    cleanBizno: cleanBizno,
    year: det.year || '',
    month: det.month || '',
    ceo: det.ceo || '',
    tel: det.tel || '',
    fax: det.fax || '',
    emp: det.employees || '',
    status: det.status || '계속사업자',
    closeDate: det.closeDate || '',
    source: cleanBizno ? `https://bizno.net/article/${cleanBizno}` : '',
    proof: '비즈노 사업자등록번호 및 부산 소재지/대표자 일치'
  };
}

// Add the 44 newly verified companies
for (const item of list43) {
  const r = item.rowNumber;
  let yr = '', mo = '';
  if (item.estDate) {
    const parts = item.estDate.split('-');
    yr = parts[0] || '';
    mo = parts[1] ? String(parseInt(parts[1], 10)) : '';
  }
  
  masterMap[r] = {
    rowNumber: r,
    name: item.name,
    bizno: item.bizno,
    cleanBizno: item.cleanBizno,
    year: yr,
    month: mo,
    ceo: item.foundCeo || item.targetCeo || '',
    tel: item.foundPhone || item.targetPhone || '',
    fax: item.foundFax || '',
    emp: item.emp || '',
    status: item.status || '계속사업자',
    closeDate: item.closeDate || '',
    source: item.source,
    proof: item.strictProof
  };
}

const masterList = Object.values(masterMap).sort((a, b) => a.rowNumber - b.rowNumber);
console.log(`Total consolidated master verified companies: ${masterList.length}`);

fs.writeFileSync(path.join(SCRATCH_DIR, 'master_verified_194.json'), JSON.stringify(masterList, null, 2), 'utf8');
