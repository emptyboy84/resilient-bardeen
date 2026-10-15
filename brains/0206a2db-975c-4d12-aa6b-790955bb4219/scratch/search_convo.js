const fs = require('fs');

const content = fs.readFileSync('brain_logs\\README_대화기록.md', 'utf8');
console.log('Length:', content.length);

const lines = content.split('\n');
const matched = [];
lines.forEach((l, i) => {
  if (l.includes('종업원') || l.includes('인원') || l.includes('NICE') || l.includes('비즈노') || l.includes('국민연금')) {
    matched.push(`${i+1}: ${l.trim()}`);
  }
});

console.log('Matches:', matched.length);
console.log(matched.slice(0, 40).join('\n'));
