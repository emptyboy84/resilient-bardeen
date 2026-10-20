const fs = require('fs');

const missingTargets = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
const stage1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
const stage2 = fs.existsSync('stage2_results.json') ? JSON.parse(fs.readFileSync('stage2_results.json', 'utf8')) : {};
const stage3 = fs.existsSync('stage3_kakao_results.json') ? JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8')) : {};

const deepTargets = [];

for (const item of missingTargets) {
  const biz = item.bizNo.replace(/[^0-9]/g, '');
  const p3 = stage3[biz]?.phone;
  const p2 = stage2[biz] ? (typeof stage2[biz] === 'object' ? stage2[biz].phone : stage2[biz]) : null;
  const p1 = stage1[biz];

  const current = p3 || p2 || p1;
  const isMasked = current && current.includes('*');
  const isMissing = !current;

  if (isMissing || isMasked) {
    deepTargets.push({
      seq: item.seq,
      name: item.name,
      ceo: item.ceo,
      bizNo: item.bizNo,
      cleanBiz: biz,
      corpNo: item.corpNo,
      address: item.address,
      currentPhone: current || null,
      status: isMasked ? 'MASKED' : 'MISSING'
    });
  }
}

fs.writeFileSync('deep_targets_2277.json', JSON.stringify(deepTargets, null, 2), 'utf8');
console.log(`Saved deep_targets_2277.json with ${deepTargets.length} items`);
console.log(`- Completely missing: ${deepTargets.filter(x => x.status === 'MISSING').length}`);
console.log(`- Masked: ${deepTargets.filter(x => x.status === 'MASKED').length}`);
