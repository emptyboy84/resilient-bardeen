const fs = require('fs');
const report = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_corp_reg_number/bae_validation_report.json', 'utf-8'));

console.log('=== 1. 개인사업자인데 법인번호 기재 (5건) ===');
report.individualWithCorp.forEach(r => {
  console.log(`- [행 ${r.rowNumber}] ${r.company} | 사업자번호: ${r.bizno} (유형: ${r.bizType}) | 법인번호: ${r.corpNo} | 체크섬: ${r.validChecksum ? '유효' : '불일치'}`);
});

console.log('\n=== 2. 법인번호 체크섬 불일치 (12건) ===');
report.invalidChecksum.forEach(r => {
  console.log(`- [행 ${r.rowNumber}] ${r.company} | 사업자번호: ${r.bizno} (유형: ${r.bizType}) | 법인번호: ${r.corpNo}`);
});

console.log(`\n=== 3. 법인인데 법인번호 누락 (총 ${report.missingCorp.length}건) ===`);
report.missingCorp.forEach((r, idx) => {
  console.log(`${idx + 1}. [행 ${r.rowNumber}] ${r.company} | 사업자: ${r.bizno} | 유형: ${r.bizType} | 비고: ${r.note || '-'}`);
});
