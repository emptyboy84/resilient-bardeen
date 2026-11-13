const fs = require('fs');
const js = fs.readFileSync('langustory_bundle.js', 'utf8');

// 전화번호
const phones = js.match(/(?:0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}|010[-\s]?\d{4}[-\s]?\d{4}|1\d{3}[-\s]?\d{4})/g) || [];
console.log('Phones in bundle:', [...new Set(phones)]);

// 이메일
const emails = js.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
console.log('Emails in bundle:', [...new Set(emails)]);

// 사업자번호 또는 주소 주변 텍스트
const idx = js.indexOf('369-87-03547');
console.log('Idx of bno:', idx);
if (idx !== -1) {
  console.log('Context of bno:', js.substring(Math.max(0, idx - 300), idx + 300));
}

// 권오광 주변 텍스트
const idx2 = js.indexOf('권오광');
console.log('Idx of rep:', idx2);
if (idx2 !== -1) {
  console.log('Context of rep:', js.substring(Math.max(0, idx2 - 300), idx2 + 300));
}
