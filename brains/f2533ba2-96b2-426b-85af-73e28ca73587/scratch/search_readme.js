const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_corporate_numbers\\brain_logs\\README_대화기록.md', 'utf8');

const lines = content.split('\n');
console.log('Total lines in README_대화기록.md:', lines.length);

lines.forEach((l, idx) => {
  if (l.includes('수학') || l.includes('공식') || l.includes('체크섬') || l.includes('가중치') || l.includes('역산') || (l.includes('계산') && (l.includes('법인') || l.includes('번호')))) {
    console.log(`Line ${idx + 1}: ${l.trim().substring(0, 140)}`);
  }
});
