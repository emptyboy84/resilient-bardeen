const fs = require('fs');
const html = fs.readFileSync('scpark_corp.html', 'utf8');

// 전화번호/휴대폰 패턴
const phones = html.match(/(?:0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}|010[-\s]?\d{4}[-\s]?\d{4})/g) || [];
console.log('Phones in scpark:', [...new Set(phones)]);

// 이메일
const emails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
console.log('Emails in scpark:', [...new Set(emails)]);

const lines = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean);

lines.forEach((l, i) => {
  if (l.includes('비에스에스') || l.includes('김재일') || l.includes('전화') || l.includes('핸드폰') || l.includes('휴대폰') || l.includes('연락처') || l.includes('3077') || l.includes('819-9844')) {
    console.log(lines.slice(Math.max(0, i-2), Math.min(lines.length, i+4)).join(' | '));
  }
});
