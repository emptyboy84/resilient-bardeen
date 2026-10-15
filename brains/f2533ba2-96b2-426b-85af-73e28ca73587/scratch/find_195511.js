const fs = require('fs');
const lines = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_corporate_numbers\\실사DB_162건_전체_법인번호반영.txt', 'utf8').split('\n');

console.log('--- 195511 Companies in DB ---');
lines.forEach((l, idx) => {
  if (l.includes('195511-')) {
    const p = l.split('\t');
    console.log(`[${idx+1}] Name: ${p[2]} | Biz: ${p[3]} | Corp: ${p[13]}`);
  }
});
