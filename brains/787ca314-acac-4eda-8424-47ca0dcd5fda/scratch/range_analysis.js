const fs = require('fs');
const report = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_corp_reg_number/bae_validation_report.json', 'utf-8'));

const ranges = [
  [ 702, 801 ],
  [ 1001, 1100 ],
  [ 1801, 1900 ],
  [ 2401, 2500 ],
  [ 3301, 3400 ],
  [ 5001, 5500 ],
  [ 11847, 12346 ]
];

ranges.forEach(([start, end]) => {
  const subset = report.allRows.filter(r => r.rowNumber >= start && r.rowNumber <= end);
  const valid = subset.filter(r => r.hasCorp && r.validChecksum);
  const indNoCorp = subset.filter(r => !r.isCorpEntity && !r.hasCorp);
  const missing = subset.filter(r => r.isCorpEntity && !r.hasCorp);
  const indWithCorp = subset.filter(r => !r.isCorpEntity && r.hasCorp);
  const badChecksum = subset.filter(r => r.hasCorp && !r.validChecksum);

  console.log(`구간 [${start}~${end}] (총 ${subset.length}건): 정상법인=${valid.length}, 개인(미기재정상)=${indNoCorp.length}, 법인누락=${missing.length}, 개인인데법인기재=${indWithCorp.length}, 체크섬오류=${badChecksum.length}`);
});
