const fs = require('fs');
const html = fs.readFileSync('ftc_view_bss.html', 'utf8');

// 테이블의 행들을 모두 출력
const tableMatches = html.match(/<table[\s\S]*?<\/table>/gi) || [];
console.log('Tables found:', tableMatches.length);
tableMatches.forEach((t, i) => {
  const text = t.replace(/<[^>]+>/g, '\n').split('\n').map(l => l.trim()).filter(Boolean).join(' | ');
  console.log(`Table ${i}:`, text);
});

// 전화번호/휴대폰 패턴
const phones = html.match(/(?:0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}|010[-\s]?\d{4}[-\s]?\d{4})/g) || [];
console.log('Phones in FTC view:', [...new Set(phones)]);

// 이메일 패턴
const emails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
console.log('Emails in FTC view:', [...new Set(emails)]);
