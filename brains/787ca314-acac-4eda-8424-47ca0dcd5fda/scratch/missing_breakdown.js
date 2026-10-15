const fs = require('fs');
const report = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_corp_reg_number/bae_validation_report.json', 'utf-8'));

// 74 missing breakdown
const missingBreakdown = {
  aptAndUnincorporated: [], // 아파트입주자대표회의, 상인회, 복지관 등 비영리단체
  closedCorp: [], // 폐업 상태인 법인
  activeCorpMissing: [] // 정상 운영 중인데 법인번호 누락된 진짜 대상!
};

report.missingCorp.forEach(r => {
  const comp = r.company;
  const isAptOrAssoc = comp.includes('입주자대표회의') || comp.includes('관리사무소') || comp.includes('관리단') || comp.includes('상인회') || comp.includes('복지관') || comp.includes('센터') || comp.includes('합창단') || comp.includes('어린이집');
  
  if (r.note === '폐업') {
    missingBreakdown.closedCorp.push(r);
  } else if (isAptOrAssoc && r.bizType === '비영리법인') {
    missingBreakdown.aptAndUnincorporated.push(r);
  } else {
    missingBreakdown.activeCorpMissing.push(r);
  }
});

console.log('=== [법인번호 누락 74건 상세 분류] ===');
console.log(`1. 아파트/입주자대표/비영리단체 (법인등록번호 원래 없는 고유번호증 단체): ${missingBreakdown.aptAndUnincorporated.length}건`);
console.log(`2. 폐업 법인 (폐업으로 인해 미기재/삭제된 건): ${missingBreakdown.closedCorp.length}건`);
console.log(`3. 정상 영업 중인데 법인번호 누락된 법인 (실제 입력/보완 필요 대상): ${missingBreakdown.activeCorpMissing.length}건`);

console.log('\n--- [3. 정상 영업 중인데 법인번호 누락된 법인 목록] ---');
missingBreakdown.activeCorpMissing.forEach(r => {
  console.log(`행 ${r.rowNumber} | ${r.company} | 사업자번호: ${r.bizno} | 형태: ${r.bizType} | 비고: ${r.note || '영업중'}`);
});
