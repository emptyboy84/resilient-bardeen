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
  if (mid === '83') return '국가/지자체';
  if (mid === '84') return '외국법인';
  if (mid === '33') return '사내근로복지기금/단체';
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

const list = lines.map((line, idx) => {
  const p = line.split('\t');
  const manager = (p[0] || '').trim();
  const status = (p[1] || '').trim();
  const company = (p[2] || '').trim();
  const bizno = (p[3] || '').trim();
  const rep = (p[4] || '').trim();
  const zip = (p[5] || '').trim();
  const address = (p[6] || '').trim();
  const phone = (p[7] || '').trim();
  const fax = (p[8] || '').trim();
  const homepage = (p[9] || '').trim();
  const email = (p[10] || '').trim();
  const employees = (p[11] || '').trim();
  const industry = (p[12] || '').trim();
  const corpNo = (p[13] || '').trim();
  
  const bizType = getBizType(bizno);
  const isCorp = ['영리법인본점', '영리법인지점', '비영리법인'].includes(bizType) ||
                 company.includes('(주)') || company.includes('주식회사') || company.includes('㈜') || company.includes('법인');

  return {
    rowNo: idx + 1,
    company,
    bizno,
    rep,
    address,
    bizType,
    isCorp,
    corpNo,
    validCheckDigit: isValidCorpNo(corpNo)
  };
});

const corps = list.filter(item => item.isCorp);
const individuals = list.filter(item => !item.isCorp);

console.log('Total input rows:', list.length);
console.log('Corporations (법인 대상):', corps.length);
console.log('Individuals (개인사업자):', individuals.length);

console.log('\n--- 법인 목록 ---');
corps.forEach(c => {
  console.log(`[${c.rowNo}] ${c.company} | 사업자:${c.bizno} | 유형:${c.bizType} | 대표:${c.rep} | 기존법인번호:'${c.corpNo}'`);
});
