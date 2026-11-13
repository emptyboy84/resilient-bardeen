const fs = require('fs');
const html = fs.readFileSync('marketbz_detail_8118703091.html', 'utf8');

// 전화번호/팩스 등
const phones = html.match(/(?:0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}|010[-\s]?\d{4}[-\s]?\d{4})/g) || [];
console.log('Phones in marketbz:', [...new Set(phones)]);

// 이메일
const emails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
console.log('Emails in marketbz:', [...new Set(emails)]);

// 텍스트 블록
const lines = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0);

lines.forEach((l, i) => {
  if (l.includes('전화') || l.includes('대표자') || l.includes('설립') || l.includes('업종') || l.includes('홈페이지')) {
    console.log(lines.slice(Math.max(0, i-1), Math.min(lines.length, i+3)).join(' | '));
  }
});
