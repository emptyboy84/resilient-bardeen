const fs = require('fs');

const missingTargets = JSON.parse(fs.readFileSync('cretap_missing_phone_targets.json', 'utf8'));
const stage1 = JSON.parse(fs.readFileSync('full_cretap_results.json', 'utf8'));
const stage2 = fs.existsSync('stage2_results.json') ? JSON.parse(fs.readFileSync('stage2_results.json', 'utf8')) : {};
const stage3 = fs.existsSync('stage3_kakao_results.json') ? JSON.parse(fs.readFileSync('stage3_kakao_results.json', 'utf8')) : {};

// Identify who is STILL completely missing or masked
const stillMissing = [];
const maskedList = [];

for (const item of missingTargets) {
  const biz = item.bizNo.replace(/[^0-9]/g, '');
  const p3 = stage3[biz]?.phone;
  const p2 = stage2[biz] ? (typeof stage2[biz] === 'object' ? stage2[biz].phone : stage2[biz]) : null;
  const p1 = stage1[biz];

  const current = p3 || p2 || p1;
  if (!current) {
    stillMissing.push(item);
  } else if (current.includes('*')) {
    maskedList.push({ ...item, currentPhone: current });
  }
}

console.log(`Total missing targets initially: ${missingTargets.length}`);
console.log(`Still completely missing: ${stillMissing.length}`);
console.log(`Masked (upgradeable): ${maskedList.length}`);
console.log(`Total targets to deeply search: ${stillMissing.length + maskedList.length}`);

// Sample 10 from stillMissing
console.log('\nSample 10 still missing:');
console.log(stillMissing.slice(0, 10).map(x => `[${x.seq}] ${x.name} (${x.bizNo}) - ${x.address}`));
