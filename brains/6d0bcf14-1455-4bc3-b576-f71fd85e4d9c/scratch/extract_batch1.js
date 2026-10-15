const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\data\\missing_from_282.json', 'utf-8'));

const batch1 = missing.slice(0, 35);
console.log(`Batch 1 size: ${batch1.length} companies`);
batch1.forEach((c, idx) => {
  console.log(`[#${idx + 1}] Seq: ${c.seq} | 기업명: ${c.name} | 대표: ${c.ceo} | 사업자: ${c.bizNo} | 주소: ${c.address} | 상태: ${c.source}`);
});

fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\data\\batch1_targets.json', JSON.stringify(batch1, null, 2), 'utf-8');
